const numSections = 4
const getTopSongs = (csv, artist, total) => {       
    // Find all songs and their popularities in given genre
    const songs = {}
    csv.filter((element) => element["Artist"] === artist).forEach(element => {
        const s = element["Title"].slice(0, 18)
        if (s in songs) {
            songs[s] += parseInt(element["Popularity"])
        } else {
            songs[s] = parseInt(element["Popularity"])
        }
    })

    // Sort the songs by their popularity
    const songKeys = Object.keys(songs);
    songKeys.sort(function (a, b) {
        return songs[b] - songs[a];
    })

    // Find top 3 songs
    const n = total*songKeys.length/100 // random math rn...
    const topSongs = songKeys.splice(0, n)

    const data = []
    topSongs.forEach(s => {
        data.push(
            {
                name: s,
                value: songs[s] 
            }
        )
    })
    return data

}

const getTopArtists = (csv, genre, total) => {
    // Find all artists and their popularities in given genre
    const artists = {}
    const counts = {}
    csv.filter((element) => element["Top Genre"] === genre).forEach(element => {
        const a = element["Artist"].slice(0, 18)
        if (a in artists) {
            artists[a] += parseInt(element["Popularity"])
            counts[a] += 1
        } else {
            artists[a] = parseInt(element["Popularity"])
            counts[a] = 1
        }
    })
    // Sort the artists by their popularity
    const artistKeys = Object.keys(artists);
    artistKeys.sort(function (a, b) {
        return artists[b] - artists[a];
    })
    const n = total*artistKeys.length/200
    // Find top 3 artists
    const topArtists = artistKeys.splice(0, n)

    const data = []
    topArtists.forEach(a => {
        data.push(
            {
                name: a,
                children: getTopSongs(csv, a, artists[a]/artistKeys.length)
            }
        )
    })
    return data

}

const getTopGenres = (csv) => {
    // Parse genres and their popularities in a dictionary
    const genres = {} // name -> popularity
    const counts = {}
    csv.forEach(element => {
        const g = element["Top Genre"]
        if (g in genres) {
            genres[g] += parseInt(element["Popularity"])
            counts[g] += 1

        } else {
            genres[g] = parseInt(element["Popularity"])
            counts[g] = 1
        }
    });

    // Sort the genres by their popularity
    const genreKeys = Object.keys(genres);
    genreKeys.sort(function (a, b) {
        return genres[b] - genres[a];
    })
    // Find top 3 genres
    const topGenres = genreKeys.splice(0, numSections) // ["genre", ...]

    const data = []
    let totalPercentageUsed = 0
    topGenres.forEach(g => {
        totalPercentageUsed += genres[g]/csv.length
        data.push(
            {
                name: g,
                children: getTopArtists(csv, g, genres[g]/genreKeys.length) // last parameter should be popularity percentage
            }
        )
    })

    data.push({
        name:"other",
        value: 100 - totalPercentageUsed
    })

    return data

}

const parseCSV = csv => {
    const data = {
        name: "genres",
        children: getTopGenres(csv)
    }

    
    // data = {
    //     name: "genres",
    //     children: [ // top 3 genres based on popularity
    //         {
    //             name: "top genre",
    //             children: [ // top 3 artists in that genre based on polularity
    //                 {
    //                     name: "artist",
    //                     children: [ // songs with popularity scores

    //    ] }] }]}
    return data
}