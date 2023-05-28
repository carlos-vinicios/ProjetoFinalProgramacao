from PySide2.QtWidgets import (
    QWidget,
    QPushButton,
    QFileDialog,
    QVBoxLayout,
    QHBoxLayout,
    QScrollArea
)

from PySide2.QtCore import (
    Qt
)

from PySide2.QtGui import (
    QCursor
)

from src.interface import (
    DatabaseItem
)

from src.controller import (
    VideoProcessController,
    DataController
)

class MainWindow(QWidget):

    def __init__(self, parent=None):
        super(MainWindow, self).__init__(parent)

        self.settings()
        self.create_widgets()
        self.set_layout()
        self.add_widgets()
        
        self.data_controller = DataController()
        self.process_controller = VideoProcessController()

        self.load_uploaded_databases()
    
    def settings(self):
        self.resize(1200, 500)
        self.setWindowTitle("Sistema de Analise de Curvas de Óleo")

    def create_widgets(self):
        # Butões
        self.btn_load_database = QPushButton("Carregar Base")
        self.btn_load_database.setObjectName("loadDatabaseButton")
        self.btn_load_database.setFixedWidth(200)
        self.btn_load_database.setCursor(QCursor(Qt.PointingHandCursor))
        
        # Sinais
        self.btn_load_database.clicked.connect(self.add_new_database)

    def set_layout(self):        
        self.scroll = QScrollArea()
        self.scroll.setObjectName("databaseContainer")
        self.widget = QWidget()
        
        self.databases_layout = QVBoxLayout()
        self.databases_layout.setMargin(0)
        self.databases_layout.setSpacing(0)
        self.databases_layout.setContentsMargins(0, 0, 0, 0)
        self.databases_layout.setAlignment(Qt.AlignTop)

        self.widget.setLayout(self.databases_layout)
        self.scroll.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOn)
        self.scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.scroll.setWidgetResizable(True)
        self.scroll.setWidget(self.widget)
        
        self.buttons_layout = QVBoxLayout()
        self.buttons_layout.setAlignment(Qt.AlignTop)
        
        main_layout = QHBoxLayout()
        main_layout.addWidget(self.scroll)
        main_layout.addLayout(self.buttons_layout)

        self.setLayout(main_layout)

    def add_widgets(self):
        self.buttons_layout.addWidget(self.btn_load_database)

    def add_new_database(self):
        system_path, _ = QFileDialog.getOpenFileName(
            self, "Selecione um arquivo de dados", filter="VID(*.txt *.csv *.xlsx *.h5 *.hdf5 *.mat *.pkl)")
        if system_path == '':
            return
        
        self.data_controller.save_database(system_path)
        database = DatabaseItem(database_name=system_path, delete_event=self.data_controller.delete_data_file)
        self.databases_layout.addWidget(database)

    def load_uploaded_databases(self):
        databases = self.data_controller.get_databases()
        for d in databases:
            database = DatabaseItem(
                database_name=d, 
                delete_event=self.data_controller.delete_data_file,
                load_event=self.data_controller.get_database
            )
            self.databases_layout.addWidget(database)
    
