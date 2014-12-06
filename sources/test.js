
testCards =
    {"package" : [
        { "rank" : "9", "shape": "heart"},
        { "rank" : "9", "shape": "spade"},
        { "rank" : "9", "shape": "club"},
        { "rank" : "9", "shape": "diamond"},
        { "rank" : "10", "shape": "spade"},
        { "rank" : "J", "shape": "club"},
        { "rank" : "Q", "shape": "heart"},
        { "rank" : "K", "shape": "diamond", "kozar": true}
    ],

    "players" : [
        { "name" : "yuval",
          "cards": [
              { "rank" : "10", "shape": "heart"},
              { "rank" : "J", "shape": "heart"},
              { "rank" : "Q", "shape": "club"},
              { "rank" : "Q", "shape": "diamond"}
          ]
        },

        { "name" : "keren",
            "cards": [
                { "rank" : "10", "shape": "diamond"},
                { "rank" : "J", "shape": "diamond"},
                { "rank" : "K", "shape": "heart"},
                { "rank" : "K", "shape": "club"}
            ]
        },

        { "name" : "alon",
            "cards": [
                { "rank" : "J", "shape": "spade"},
                { "rank" : "K", "shape": "spade"},
                { "rank" : "10", "shape": "club"},
                { "rank" : "Q", "shape": "spade"}
            ]
        }
    ]
}