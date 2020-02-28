# [Visualization for Spotify's music data](https://anisha7.github.io/d3project/)

## Description
This project utilizes the D3 library to generate visualizations for [spotify's music data](https://www.kaggle.com/iamsumat/spotify-top-2000s-mega-dataset/data). It shows the most popular genres, artists, and their music. It also links the song to youtube.

## Getting started (how to run the project)
1. Clone or download repository
2. Open index.html in your browser

## [Link to live project](https://anisha7.github.io/d3project/)

## Background Information
This data is based on the top 2000 tracks on Spotify. This API is updated frequenty (last update 24 days ago). We can see popularities for each song, along with their genres, artists, release year, and so much more. More information on the dataset is available [here](https://www.kaggle.com/iamsumat/spotify-top-2000s-mega-dataset/data).


## Implementation
Portions of my implementation are reusable.

**Visualizer.js** consists of code that generates and styles the graph. It needs data of the following format:

```
data = {
         name: "string",
         children: [ 
             {
                 name: "string",
                 children: [ 
                     {
                         name: "string",
                         value: number

        ] }] }]}
```

You can have as many categories with children as you want, but be sure that the inner most one has a value property. This will be the determining factor for how much space each category gets in the space.

**parser.js** outlines how I parsed through the spotify data. 

_Additionally, the test folder was an experiment to learn and understand d3. It can be used to see a simpler example with d3._

