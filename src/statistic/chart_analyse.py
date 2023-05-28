import statistics
import numpy as np
from scipy.integrate import simps


class ChartAnalyse:

    def __init__(self, b_perc: list, timestamp: list, fps: float, tresholds: list = []):
        self.b_perc = b_perc
        self.timestamp = timestamp
        self.area = round(self.__area_under_the_chart(fps), 2)
        self.mean_blood_presence = round(self.__avg_screen_blood(), 2)
        self.median_blood_presence = round(self.__median_screen_blood(), 2)
        self.stdev_blood_presence = round(self.__pstdev_screen_blood(), 2)
        self.bleed_data = self.__generate_bleed_data(
            tresholds)

    def __avg_screen_blood(self):
        avg = statistics.mean(self.b_perc)
        return avg

    def __median_screen_blood(self):
        median = statistics.median(self.b_perc)
        return median

    def __pstdev_screen_blood(self):
        pstdev = statistics.pstdev(self.b_perc)
        return pstdev

    def __area_under_the_chart(self, fps):
        area = simps(np.array(self.b_perc), dx=(
            self.timestamp[1]-self.timestamp[0]))
        return area

    # taxa de ocorrencia de sangramento baseado em um limiar
    def __bleed_rate_treshold(self, treshold_blood_perc: int):
        i_over_tresh = [index for index, perc in enumerate(
            self.b_perc) if perc >= treshold_blood_perc]

        rate = round(len(i_over_tresh) * 100 / len(self.b_perc), 2)

        return rate, i_over_tresh

    # intervalos de sangramento
    def __bleed_intervals(self, bleed_sequence: list):
        intervals = []
        start = end = 0
        larger = None
        larger_len = 0
        range_stop = len(bleed_sequence)-1
        for i in range(0, range_stop):
            if bleed_sequence[i+1] - bleed_sequence[i] == 1:
                end = i + 1
                if not end >= range_stop:
                    continue

            interval = (round(self.timestamp[bleed_sequence[start]], 2), round(
                self.timestamp[bleed_sequence[end]], 2))
            interval_len = end-start+1
            if larger is None or interval_len > larger_len:
                larger = interval
                larger_len = interval_len
            intervals.append(interval)

            start = i + 1
            end = start

        return intervals, larger

    def __get_larger_interval(self, intervals: list):
        larger = intervals[0]
        for inter in intervals[1:]:
            if inter[2] > larger[2]:
                larger = inter

        return larger

    def __get_interval_timestamp(self, index_list: list, interval: tuple):
        time_interval = self.timestamp[index_list[interval[0]]:index_list[interval[1]]]
        return time_interval[0], time_interval[-1]

    def __generate_bleed_data(self, tresholds):
        data = {}
        tresholds.insert(0, self.mean_blood_presence)

        for t in tresholds:
            
            rate, bleed_sequence = self.__bleed_rate_treshold(t) #calcula a taxa de sangramento do video em relação a um tresh
            intervals, larger_interval = self.__bleed_intervals(bleed_sequence) #captura os intervalos de sangramento

            data[t] = {
                "rate": rate,
                "intervals": intervals,
                "larger interval": larger_interval
            }
           
        return data
