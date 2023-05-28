from src.interface import MainWindow
from src.styles import app_styles
from PySide2.QtWidgets import QApplication
from datetime import datetime

import sys


def main(args):
    root = QApplication(args)

    app = MainWindow()
    app.show()

    root.setStyleSheet(app_styles)
    sys.exit(root.exec_())

if __name__ == '__main__':
    main(sys.argv)
