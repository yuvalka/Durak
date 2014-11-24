/**
 * Created by yuval on 11/7/14.
 */


/**
 *  basic configs
 */
var DurakConfig = (function() {
    var private = {
        'USER_STATUS_ATTACKER': 'attacker',
        'USER_STATUS_DEFENDER': 'defender',
        'USER_STATUS_HOLD': 'hold'

    };

    var cardPriority = {2:1,3:2,4:3,5:4,6:5,7:6,8:7,9:8,10:9,'J':10,'Q':11,'K':12,'A':13}

    return {
        get: function(name) { return private[name]; },
        cardPriority: function(CardNum) { return cardPriority[CardNum]}
    };
})();


/**
 * presents specific card for a game
 * @param number
 * @param shape
 * @param priority
 * @constructor
 */
function Card(number,shape) {
    this.shape = shape;
    this.number = number;
    this.holder = null;
}

/**
 * generated package for a game
 * @param lowest_card
 * @constructor
 */
function Package(lowest_card) {
    this.is_shuffled = false;
    this.possible_cards= [] ;

    if (lowest_card === 'undefined') {
        lowest_card = 6;
    }

    for (card_num = lowest_card; card_num < 11; card_num++) {
        this.possible_cards.push(card_num);
    }

    this.possible_cards = this.possible_cards.concat(['J','Q','K','A']);
    this.shapes =  ['spade','diamond','club','heart'];
    this.cards = [];

    this.init = function() {
       if (this.cards.length != 0 ){
           return;
       }

       for (var i in this.possible_cards) {

           for (var j in this.shapes) {
               this.cards.push(new Card(this.possible_cards[i],this.shapes[j]));
           }
       }

       this.shuffle();
    }

    this.shuffle = function() {
        if (!this.is_shuffled) {
            for(var j, x, i = this.cards.length; i;j = Math.floor(Math.random() * i),
            x = this.cards[--i], this.cards[i] = this.cards[j],
            this.cards[j] = x);

            this.is_shuffled = true;
        }
    }

    this.draft = function(num_cards,player){
        if (this.cards.length < num_cards ){
            num_cards = this.cards.length;
        }
        var cards = this.cards.splice(0,num_cards);
        cards.forEach(function(card){
            card.holder = player.name;
            player.cards.push(card);
        });
    }

    this.selectKozar = function(){
        console.log('selecting kozar');
        var kozar = this.cards[0];
        console.log(kozar);
        this.cards.push(this.cards.splice(0,1)[0]);
        return kozar.shape;
    }
}

function Player(name) {
    this.name = name;
    this.cards = [];
}



function Board() {
    this.cardsAttack = [];
    this.cardsDefense = [];
}

function Game() {

    this.package = null;
    this.players = [];
    this.attacker = null;
    this.defender = null;
    this.kozar = null;
    this.board = [];

    /**
     * add player to players list, if name exists throw error
     * @param player
     */
    this.addPlayer =  function (player) {

        // validate player
        var existedPlayer = this.getPlayerByName(player.name)

        if (!existedPlayer){
            this.players.push(player);
        }else{
            throw "player exist";
        }
    };


    this.init = function() {
        var game = this;
        this.players.forEach(function(player) {
            game.package.draft(6,player);
        });

        game.kozar = game.package.selectKozar();
        this.board = new Board;
        game.attacker = this.players[0];
        game.defender = this.players[1];
    }


    this.findAndUpdatePlayerKey = function(name, params) {
        var player = this.getPlayerByName(name);
        for (var key in params) {
            if (player.hasOwnProperty(key)) {
                player[key] = params[key];
            }
        }
    }

    this.getPlayerByName = function(name) {

        var result = null;
        this.players.map(function(player) {
            if (player.name == name) {
                result = player;
            }
        });
        return result;
    }



    this.attack = function(cardAttack) {
        var game = this;
        var playerAttack = this.getPlayerByName(attackerName);
        var aCard=null;

        var i = 0;
        playerAttack.cards.forEach(function(card){
           if (card.number == cardAttack.number && card.shape == cardAttack.shape ){
               aCard = playerAttack.cards.splice(i,1)[0];
               return;
           }
           i++;
        });

        game.board.cardsAttack.push(aCard);
    }




}



function test() {

   game = new Game();
   game.package =  new Package(6);
   game.package.init();
   game.addPlayer(new Player('yuval'));
   game.addPlayer(new Player('keren'));
   game.addPlayer(new Player('alon'));
   game.addPlayer(new Player('tamar'));
   game.init();
   console.log(game.getPlayerByName('yuval').cards);

}


