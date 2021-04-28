# Coco Stream
A NodeJS webserver that lets your stream the content of mp4 videos inside a folder on your local machine in your local network.

## Setup
- clone the repo
- `cd` into the repo
- `npm install`
- create a `.env` file and add to it all the folders in which you have the video files that you want to show, in this way:
    - `FOLDER_[CUSTOM_NAME]=absolute_path_to_folder`. You can replace `[CUSTOM_NAME]` with any name you want. Try using numbers and letters only, and replace spaces with underscores. No, you don't have to keep the brakets.
- `npm start`
- visit [localhost:3000](http://localhost:3000) and you'll see the list of folders with the `CUSTOM_NAME` you gave them and the list of files. You can change the port passing the `PORT` envirnonment variable
    