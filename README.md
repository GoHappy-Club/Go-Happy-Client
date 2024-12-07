# Zoom Setup
    - If 'mobilertc' file not already downloaded go to scripts folder and run 'downloadFiles' script using 'node downloadFiles.js'
    - To build an app with zoom, run the 'installZoom' script
    - To build a development build, run the 'removeZoom' script
    - For zoom integrated app, Change two files
        - index.js :- uncommend the zoom sdk provider code and it's import
        - android/app/build.gradle - uncomment lines 151 and 152 (include mobile rtc and flex box one)
    - For development build comment the above lines of codes
