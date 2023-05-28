import numpy as np
import matplotlib.pyplot as plt
import cv2
from collections import Counter
from skimage.color import rgb2lab, deltaE_cie76
from sklearn.cluster import MiniBatchKMeans, KMeans

#bleed_by_time
# Argumentos:
############# Capture: Tipo cv2.VideoCapture

def bleed_by_time_analysis_frame(frame):
    size = frame.size
    
    red_min = np.array([0,0,53], np.uint8)
    red_max = np.array([87,80,145], np.uint8)

    distr = cv2.inRange(frame, red_min, red_max)
    n_red = cv2.countNonZero(distr)
    
    frac_red = np.divide(float(n_red), int(size))
    red_perc = frac_red * 100
    
    return red_perc

def bleed_by_time_analysis(capture, total_frames, progress_bar, frame_preview, intervals=1):
    pass
    # percent = int(total_frames / 100)
    # count_prct = 0
    # actual_progress = 1
    
    # blood_perc=[]
    # timestamp = []

    # ini = time.time()

    # for i in range(0,total_frames):
    #     count_prct += 1

    #     if count_prct >= percent:
    #         count_prct = 0
    #         actual_progress += 1
    #         progress_bar.setValue(actual_progress)
        
    #     if i % intervals  == 0:

    #         (grabbed, frame) = capture.read()

    #         # Verificar se é mais rápido ou lento com isso
    #         frame = cv2.resize(frame, (400,400))
            
    #         size = frame.size
            
    #         red_min = np.array([0,0,53], np.uint8)
    #         red_max = np.array([87,80,145], np.uint8)

    #         distr = cv2.inRange(frame, red_min, red_max)
    #         n_red = cv2.countNonZero(distr)

    #         frac_red = np.divide(float(n_red), int(size))
    #         red_perc = frac_red * 100

    #         blood_perc.append(red_perc)
    #         timestamp.append(float(i)/3600.0)

    #         image_qt = QImage(frame.data, frame.shape[1], frame.shape[0], QImage.Format_RGB888).rgbSwapped()

    #         frame_preview.setPixmap(QPixmap.fromImage(image_qt))

    #         QApplication.processEvents()

    # fim = time.time()
    # tempo_conclusao = fim - ini

    # return blood_perc, timestamp

def create_bleed_fig():
    fig, ax = plt.subplots(figsize=(2.5, 3.4))
    return fig, ax

def plot_bleed_by_time(ax, blood_perc, timestamp):
    ax.set_xlabel('Tempo (min)')
    ax.set_ylabel('Sangramento em tela (%)')
    ax.plot(timestamp,blood_perc)

    return ax

def smooth(y, box_pts):
    box = np.ones(box_pts)/box_pts
    y_smooth = np.convolve(y, box, mode='same')
    return y_smooth