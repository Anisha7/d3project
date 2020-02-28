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
    console.log(total)
    const n = total*numSections*0.03 // random math rn...
    console.log(n)
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
    console.log(total)
    const n = total*numSections*0.03 // random math rn...
    console.log(n)
    // Find top 3 artists
    const topArtists = artistKeys.splice(0, n) // n  instead of numSections

    const data = []
    topArtists.forEach(a => {
        data.push(
            {
                name: a,
                children: getTopSongs(csv, a, artists[a]/counts[a])
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
    topGenres.forEach(g => {
        data.push(
            {
                name: g,
                children: getTopArtists(csv, g, genres[g]/counts[g]) // last parameter should be popularity percentage
            }
        )
    })

    return data

}

const parseCSV = csv => {
    console.log(csv)
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