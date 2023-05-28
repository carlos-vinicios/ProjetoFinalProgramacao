import cv2
import time

from src.imgproc import (
    bleed_by_time_analysis_frame,
    smooth
)

from src.controller import (
    DataController,
    Worker
)

from src.statistic import (
    ChartAnalyse
)

from PySide2.QtWidgets import (
    QMessageBox
)

from PySide2.QtCore import (
    QThreadPool,
)

class VideoProcessController:

    def __init__(self):
        self.busy = False
        self.queue = []
        self.data_controller = DataController()
        self.progress_bar_value = 0
        self.thread_pool = QThreadPool()
        self.n_jobs = self.thread_pool.maxThreadCount() - 1
        self.video_fps = None
        self.start_video_time = None
        self.blood_percs = {}
        self.timestamps = {}
        self.threads_ended = 0
        self.duration = 0

    def append_to_queue(self, video_item):
        self.queue.append(video_item)
        self.check_queue()

    def check_queue(self):
        if not self.busy and len(self.queue) > 0:
            self.process_video()

    def update_state(self):
        self.queue.pop(0)
        self.busy = False
        self.check_queue()

    def register_end_thread(self, video):
        self.threads_ended += 1

        if self.threads_ended >= self.n_jobs:
            self.finish_video_process(video)

    def finish_video_process(self, video):
        smooth_value = int(self.video_fps * 2)
        total_time = float((time.time() - self.start_video_time)/60)

        blood_perc = []
        timestamp = []

        for i in range(self.n_jobs):
            blood_perc += self.blood_percs[i]
            timestamp += self.timestamps[i]

        self.blood_percs.clear()
        self.timestamps.clear()

        smoothed_blood_perc = list(smooth(blood_perc, smooth_value))
        chartAnalyse = ChartAnalyse(
            smoothed_blood_perc,
            timestamp, self.video_fps,
            [1.5, 6]
        )

        area = chartAnalyse.area
        blood_mean = chartAnalyse.mean_blood_presence
        blood_median = chartAnalyse.median_blood_presence
        blood_stdev = chartAnalyse.stdev_blood_presence
        blood_interval = chartAnalyse.bleed_data[1.5]["larger interval"]
        blood_tax = chartAnalyse.bleed_data[1.5]["rate"]

        data = {
            "name": self.queue[0].video_name,
            "fps": self.video_fps,
            "duration": self.duration,
            "blood_perc": blood_perc,
            "smoothed_blood_perc": smoothed_blood_perc,
            "timestamp": timestamp,
            "blood_mean": blood_mean,
            "blood_median": blood_median,
            "blood_stdev": blood_stdev,
            "blood_interval": blood_interval,
            "blood_tax": blood_tax,
            "area": area,
            "total_time": total_time
        }

        self.data_controller.save_data(data["name"].split('/')[-1], data)
        video.end_processing(data)
        
        self.video_fps = None
        self.start_video_time = None
        self.threads_ended = 0
        self.duration = 0

        self.update_state()

    def process_video_part(self, video, start_frame, 
                            end_frame, thread_id,
                            progress_callback):
        capture = cv2.VideoCapture(video.video_name)

        if capture is None:
            self.error_message_box = QMessageBox.critical(self, "Erro ao abrir o vídeo",
                                                          "Não foi possível abrir {0}".format(video.video_name))
            return

        if start_frame > 0:
            capture.set(cv2.CAP_PROP_POS_FRAMES, start_frame)

        total_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
        percent = int(total_frames / 100)

        count_prct = 0

        self.blood_percs[thread_id] = []
        self.timestamps[thread_id] = []

        intervals = 1
        intervals_passed = 0

        video.progress_bar.setValue(0)

        for i in range(end_frame-start_frame):
            count_prct += 1

            if intervals_passed % 60 == 0:
                intervals_passed = 0

            if i % intervals == 0:
                (grabbed, frame) = capture.read()
                frame = cv2.resize(frame, (600, 400))

                if frame is None:
                    break

                intervals_passed += 1

                self.blood_percs[thread_id].append(
                    bleed_by_time_analysis_frame(frame))
                self.timestamps[thread_id].append(
                    (float(i+start_frame)/self.video_fps)/60)

            if count_prct >= percent:
                count_prct = 0
                self.progress_bar_value+=1
                progress_callback.emit(self.progress_bar_value)

        capture.release()
        self.register_end_thread(video)

    def process_video(self):
        video = self.queue[0]
        video.start_processing()

        self.busy = True
        self.progress_bar_value = 0
        
        capture = cv2.VideoCapture(video.video_name)
        if capture is None:
            self.error_message_box = QMessageBox.critical(self, "Erro ao abrir o vídeo",
                                                          "Não foi possível abrir {0}".format(video.video_name))
            return

        total_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
        self.video_fps = capture.get(cv2.CAP_PROP_FPS)
        self.duration = round(total_frames/self.video_fps, 2)
        capture.release()

        frames_per_thread = int(total_frames/self.n_jobs)
        start_frame = 0

        self.start_video_time = time.time()

        for i in range(self.n_jobs):
            if i < (self.n_jobs - 1):
                worker = Worker(self.process_video_part,
                                video, start_frame,
                                start_frame + frames_per_thread, i)
            else:
                worker = Worker(self.process_video_part,
                                video, start_frame, total_frames, i)

            worker.signals.progress.connect(video.update_progress)
            
            start_frame += frames_per_thread

            self.thread_pool.start(worker)

    @staticmethod
    def get_video_frame(video_path, time):
        capture = cv2.VideoCapture(video_path)
        if capture is None:
            return None

        fps = capture.get(cv2.CAP_PROP_FPS)

        capture.set(1, fps*time)

        (grabbed, frame) = capture.read()

        return frame
