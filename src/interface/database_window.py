from src.helper.timerHelper import input_time_mask, remove_time_mask, time_mask
from PySide2.QtWidgets import (
    QApplication,
    QCheckBox,
    QLineEdit,
    QPushButton,
    QLabel,
    QGridLayout,
    QWidget,
    QVBoxLayout,
    QHBoxLayout,
    QMessageBox
)

from PySide2.QtWebEngineWidgets import (
    QWebEngineView
)

from PySide2.QtCore import (
    Qt,
    QThreadPool
)

# from PySide2.QtGui import (
#     QCursor,
#     QPixmap,
#     QImage
# )

# from superqt import (
#     QRangeSlider,
# )

from src.statistic import (
    ChartAnalyse
)

# from src.controller import (
#     VideoProcessController,
#     Worker
# )

import pyqtgraph as pg
import numpy as np
# import os

class DatabaseWindow(QWidget):

    def __init__(self, database, parent=None):
        super(DatabaseWindow, self).__init__(parent)

        # self.thread_pool = QThreadPool()
        self.database = database
        self.interval = None

        # estados
        self.exporting = False

        self.settings()
        self.create_widgets()
        self.set_layout()
        self.add_widgets()

        # self.generate_event()

    def settings(self):
        self.resize(1200, 600)
        self.setWindowTitle("Resultados")

    def create_widgets(self):
        # Gráfico das curvas
        self.plot = self.create_chart()

        # #Botoes
        # self.process_btn = QPushButton("Gerar")
        # self.process_btn.setFixedWidth(200)
        # self.process_btn.setObjectName("processButton")
        # self.process_btn.setCursor(QCursor(Qt.PointingHandCursor))
        
        # self.export_btn = QPushButton("Exportar")
        # self.export_btn.setFixedWidth(200)
        # self.export_btn.setObjectName("exportButton")
        # self.export_btn.setCursor(QCursor(Qt.PointingHandCursor))
        # self.export_btn.setDisabled(True)

        # #check box
        # self.checkbox = QCheckBox("Gerar em tempo real")
        # self.checkbox.setObjectName("checkboxGeneration")

        # #labels
        # self.preview_label = QLabel("Recorte da Região de Interesse")
        # self.preview_label.setObjectName("regionLabel")

        # self.data_label = QLabel("Resultados do Processamento")
        # self.data_label.setObjectName("regionLabel")

        # self.blood_mean = QLabel("Média")
        # self.blood_mean.setObjectName("metricLabel")
        # self.blood_mean_value = QLabel("")
        # self.blood_mean_value.setObjectName("valueLabel")

        # self.blood_median = QLabel("Mediana")
        # self.blood_median.setObjectName("metricLabel")
        # self.blood_median_value = QLabel("")
        # self.blood_median_value.setObjectName("valueLabel")

        # self.blood_std = QLabel("Désvio Padrão:")
        # self.blood_std.setObjectName("metricLabel")
        # self.blood_std_value = QLabel("")
        # self.blood_std_value.setObjectName("valueLabel")

        # self.blood_interval = QLabel("Maior Intervalo:")
        # self.blood_interval.setObjectName("metricLabel")
        # self.blood_interval_value = QLabel("")
        # self.blood_interval_value.setObjectName("valueLabel")

        # self.blood_tax = QLabel("Taxa Média:")
        # self.blood_tax.setObjectName("metricLabel")
        # self.blood_tax_value = QLabel("")
        # self.blood_tax_value.setObjectName("valueLabel")

        # self.aoc = QLabel("Área Abaixo da Curva:")
        # self.aoc.setObjectName("metricLabel")
        # self.aoc_value = QLabel("")
        # self.aoc_value.setObjectName("valueLabel")

        # #timer do vídeo
        # self.slider = QRangeSlider()
        # self.slider.setRange(0, math.floor(self.video["duration"]))
        # self.slider.setValue([0, math.floor(self.video["duration"])])
        # self.slider.setOrientation(Qt.Horizontal)
        
        # self.min_input = QLineEdit()
        # self.min_input.setFixedWidth(40)
        # self.min_input.setAlignment(Qt.AlignCenter)
        # self.min_input.textEdited.connect(self.min_timer_change)
        # self.min_input.setText("0:00")

        # self.max_input = QLineEdit()
        # self.max_input.setFixedWidth(40)
        # self.max_input.setAlignment(Qt.AlignCenter)
        # self.max_input.textEdited.connect(self.max_timer_change)
        # self.max_input.setText(time_mask(math.floor(self.video["duration"])))

        # # Sinais
        # self.export_btn.clicked.connect(self.export_report)
        # self.process_btn.clicked.connect(self.generate_event)
        
        # self.slider.valueChanged.connect(self.get_frame)
    
    def set_layout(self):
        self.main_layout = QVBoxLayout()

        self.header_layout = QHBoxLayout()
        self.container_layout = QHBoxLayout()
        self.footer_layout = QHBoxLayout()

        self.preview_layout = QVBoxLayout()
        self.preview_layout.setSpacing(0)

        self.data_layout = QVBoxLayout()
    
        self.metrics_layout = QGridLayout()
        self.metrics_layout.setContentsMargins(0, 0, 0, 15)

        self.main_layout.addLayout(self.header_layout)
        self.main_layout.addLayout(self.container_layout)
        self.main_layout.addLayout(self.footer_layout)

        self.container_layout.addLayout(self.preview_layout)
        self.container_layout.addLayout(self.data_layout)
        
        self.setLayout(self.main_layout)
    
    def add_widgets(self):
        # self.header_layout.addWidget(self.preview_label, alignment=Qt.AlignCenter)
        # self.header_layout.addWidget(self.data_label, alignment=Qt.AlignCenter)
        
        # self.timer_layout.addWidget(self.min_input, alignment=Qt.AlignCenter)
        # self.timer_layout.addWidget(self.slider)
        # self.timer_layout.addWidget(self.max_input, alignment=Qt.AlignCenter)

        self.preview_layout.addWidget(self.plot)
        # self.preview_layout.addLayout(self.timer_layout)

        # self.data_layout.addWidget(self.histogram_preview)
        # self.data_layout.addLayout(self.metrics_layout)

        # self.metrics_layout.addWidget(self.blood_mean, 0, 0, alignment=Qt.AlignCenter)
        # self.metrics_layout.addWidget(self.blood_median, 0, 1, alignment=Qt.AlignCenter)
        # self.metrics_layout.addWidget(self.blood_std, 0, 2, alignment=Qt.AlignCenter)
        # self.metrics_layout.addWidget(self.blood_mean_value, 1, 0, alignment=Qt.AlignCenter)
        # self.metrics_layout.addWidget(self.blood_median_value, 1, 1, alignment=Qt.AlignCenter)
        # self.metrics_layout.addWidget(self.blood_std_value, 1, 2, alignment=Qt.AlignCenter)
        
        # self.metrics_layout.addWidget(self.blood_tax, 2, 0, alignment=Qt.AlignCenter)
        # self.metrics_layout.addWidget(self.aoc, 2, 1, alignment=Qt.AlignCenter)
        # self.metrics_layout.addWidget(self.blood_interval, 2, 2, alignment=Qt.AlignCenter)
        # self.metrics_layout.addWidget(self.blood_tax_value, 3, 0, alignment=Qt.AlignCenter)
        # self.metrics_layout.addWidget(self.aoc_value, 3, 1, alignment=Qt.AlignCenter)
        # self.metrics_layout.addWidget(self.blood_interval_value, 3, 2, alignment=Qt.AlignCenter)

        # self.footer_layout.addWidget(self.process_btn, alignment=Qt.AlignCenter)
        # self.footer_layout.addWidget(self.export_btn, alignment=Qt.AlignCenter)
    
    def create_chart(self):
        plot = pg.plot()

        scatter = pg.ScatterPlotItem(
            size=10, 
            brush=pg.mkBrush(255, 255, 255, 120)
        )
        # print(self.database.info())
        # adding points to the scatter plot
        scatter.setData(x=self.database.timestamp, y=self.database["P-PDG"])

        axis = pg.DateAxisItem()
        plot.setAxisItems({'bottom':axis})
        # add item to plot window
        # adding scatter plot item to the plot window
        plot.addItem(scatter)
        return plot

    def get_metrics(self):
        if len(self.time) != len(self.video["timestamp"]) and len(self.blood_perc) != len(self.video["blood_perc"]):
            chartAnalyse = ChartAnalyse(
                self.blood_perc, 
                self.time, self.video["fps"],
                [1.5, 6]
            )
            
            area = chartAnalyse.area
            blood_mean = chartAnalyse.mean_blood_presence
            blood_median = chartAnalyse.median_blood_presence
            blood_stdev = chartAnalyse.stdev_blood_presence
            blood_interval = chartAnalyse.bleed_data[1.5]["larger interval"]
            blood_tax = chartAnalyse.bleed_data[1.5]["rate"]
        else:
            area = self.video["area"]
            blood_mean = self.video["blood_mean"]
            blood_median = self.video["blood_median"]
            blood_stdev = self.video["blood_stdev"]
            blood_interval = self.video["blood_interval"]
            blood_tax = self.video["blood_tax"]
        
        return area, blood_mean, blood_median, blood_stdev, blood_interval, blood_tax

    # def render_metrics(self):
    #     area, blood_mean, blood_median, blood_stdev, blood_interval, blood_tax = self.get_metrics()

    #     self.blood_mean_value.setText("%.2f %s" % (blood_mean, '%'))
    #     self.blood_median_value.setText("%.2f %s" % (blood_median, '%'))
    #     self.blood_interval_value.setText("%.2f s - %.2f s" % (blood_interval[0], blood_interval[1]))
    #     self.blood_std_value.setText("%.2f %s" % (blood_stdev, '%'))
    #     self.blood_tax_value.setText("%.2f %s" % (blood_tax, '%'))
    #     self.aoc_value.setText("%.2f" % (area))

    #     self.processing = False
    #     self.slider.setDisabled(False)
    #     self.export_btn.setDisabled(False)

    # def clear_process_data(self):
    #     self.chart_ax.cla()
    #     self.chart_ax.set_xlabel('Tempo (min)')
    #     self.chart_ax.set_ylabel('Sangramento em tela (%)')
    #     self.chart_ax.set_ylim(0, 25)

    #     self.blood_mean_value.setText("")
    #     self.blood_median_value.setText("")
    #     self.blood_interval_value.setText("")
    #     self.blood_std_value.setText("")
    #     self.blood_tax_value.setText("")
    #     self.aoc_value.setText("")
    
    # def export_report(self):
    #     if self.exporting or self.processing:
    #         return
        
    #     self.exporting = True
    #     if self.time and self.blood_perc:
    #         self.save_results()

    #     QMessageBox.information(
    #         self, 
    #         "Exportação Realizada",
    #         "O resultados de processamento foram exportados com sucesso."
    #     )
    #     self.exporting = False
    
    # def save_results(self):
    #     video_name = self.video["name"].split('/')[-1].split('.')[0]
    #     start_time, end_time = self.slider.value()

    #     if not os.path.exists(video_name):
    #         os.mkdir(video_name)

    #     self.save_histogram(video_name, start_time, end_time)
    #     self.save_metrics(video_name, start_time, end_time)
    #     self.save_raw_data(video_name, start_time, end_time)

    # def save_histogram(self, video_name, start_time, end_time):
    #     self.chart_fig.savefig(
    #         "{0}/{0}_histograma_{1}_{2}.png".format(video_name, start_time, end_time),
    #         facecolor="#FFF")
    
    # def save_metrics(self, video_name, start_time, end_time):
    #     with open("{0}/{0}_metricas_{1}_{2}.csv".format(video_name, start_time, end_time), "w", newline='', encoding='utf-8') as csvfile:
    #         writer = csv.writer(csvfile, delimiter=',',
    #                             quoting=csv.QUOTE_MINIMAL)

    #         area, blood_mean, blood_median, blood_stdev, blood_interval, blood_tax = self.get_metrics()

    #         new_metrics_dict = {
    #             "blood_mean": blood_mean, 
    #             "blood_median": blood_median, 
    #             "blood_stdev": blood_stdev, 
    #             "blood_interval": blood_interval, 
    #             "blood_tax": blood_tax, 
    #             "area": area
    #         }

    #         columns_to_save = sorted(
    #             self.video.keys() - ['name', 'fps', 'duration', 'timestamp', 'blood_perc', 'smoothed_blood_perc', 'total_time'])

    #         writer.writerow(columns_to_save) #cria o header

    #         line_values = []
    #         for col in columns_to_save:
    #             line_values.append(new_metrics_dict[col])
            
    #         writer.writerow(line_values)

    # def save_raw_data(self, video_name, start_time, end_time):
    #     with open("{0}/{0}_observacoes_{1}_{2}.csv".format(video_name, start_time, end_time), "w", newline='', encoding='utf-8') as csvfile:
    #         writer = csv.writer(csvfile, delimiter=',',
    #                             quoting=csv.QUOTE_MINIMAL)

    #         writer.writerow(['timestamp', 'blood_perc'])

    #         timestamps = self.time
    #         blood_percs = self.blood_perc

    #         for time, blood in zip(timestamps, blood_percs):
    #             writer.writerow([time, blood])
    
    def closeEvent(self, event):
        if self.processing:
            reply = QMessageBox.question(self, 'Fechar janela', 'Deseja interromper o processamento do vídeo?',
            QMessageBox.Yes | QMessageBox.No, QMessageBox.No)

            if reply == QMessageBox.Yes:
                try:
                    self.thread_pool.cancel(self.preview_worker)
                    self.thread_pool.cancel(self.chart_render_worker)
                except:
                    event.accept()
                event.accept()
            else:
                event.ignore()
