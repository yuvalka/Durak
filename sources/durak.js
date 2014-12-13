/**
 * Created by yuval on 11/7/14.
 */

/**
 *  basic configs
 */
var DurakConfig = (function() {
    var props = {
        'LOWEST_CARD' : 6,
        'CARDS_PER_PLAYER' : 4,
        'END_ROUND_BITA' : 'bita',
        'END_ROUND_LOST' : 'lost'
    };

    var cardPriority = {2:1,3:2,4:3,5:4,6:5,7:6,8:7,9:8,10:9,'J':10,'Q':11,'K':12,'A':13};

    return {
        get: function(name) { return props[name]; },
        cardPriority: function(CardNum) { return cardPriority[CardNum]}
    };
})();


/**
 * presents specific card for a game
 * @param rank
 * @param shape
 * @param priority
 * @constructor
 */
function Card(rank,shape,holder) {
    this.shape = shape;
    this.rank = rank;
    this.holder = holder;

}

/**
 * generated package for a game
 * @param lowest_card
 * @constructor
 */
function Package() {
    this.is_shuffled = false;
    this.possible_cards= [] ;

    lowest_card = DurakConfig.get('LOWEST_CARD');


    for (var card_num = lowest_card; card_num < 11; card_num++) {
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
                this.cards.push(new Card(this.possible_cards[i],this.shapes[j],null));
            }
        }

        this.shuffle();
    };


    this.shuffle = function() {
        if (!this.is_shuffled) {
            var i = this.cards.length, tempVal, randI;

            // While there remain elements to shuffle...
            while (0 !== i) {

                // Pick a remaining element...
                randI = Math.floor(Math.random() * i);
                i -= 1;

                // And swap it with the current element.
                tempVal = this.cards[i];
                this.cards[i] = this.cards[randI];
                this.cards[randI] = tempVal;
            }
            this.is_shuffled = true;
            return this.cards;
        }
    };

    this.draft = function(num_cards,player){
        if (this.cards.length < num_cards ){
            num_cards = this.cards.length;
        }
        var cards = this.cards.splice(0,num_cards);
        cards.forEach(function(card){
            card.holder = player.name;
            player.cards.push(card);
        });
    };

    this.selectKozar = function(){
        console.log('selecting kozar');
        var kozar = this.cards[0];
        console.log(kozar);
        this.cards.push(this.cards.splice(0,1)[0]);
        return kozar.shape;
    };
}

function Player(name) {
    this.name = name;
    this.cards = [];

    this.omitCard = function(card){
        var pos = 0;
        var player = this;
        this.cards.forEach(function(pCard) {
            if (card.rank === pCard.rank && card.shape === pCard.shape) {
                player.cards.splice(pos,1);
            }
            pos++;
        });
    }
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
    this.bita = [];

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


    /**
     * let's set a game. well, it means that we need to shuffle package, give cards to players,
     *
     */
    this.init = function() {
        var game = this;
        this.players.forEach(function(player) {
            game.package.draft(DurakConfig.get('CARDS_PER_PLAYER'),player);
        });

        game.kozar = game.package.selectKozar();
        this.board = new Board;
        game.attacker = this.players[0];
        game.defender = this.players[1];
    };

    this.getPlayerByName = function(name,getPosition) {

        var playerFound = null;
        var i = 0;
        this.players.forEach(function(player) {
            if (player.name == name) {
                if (!getPosition)
                    playerFound =  player;
                else
                    playerFound = {"position": i, "player": player};
            }
            i++;
        });

        return playerFound;
    };



    /**
     * attacker attacks defender with 1 or more cards (can be equal in rank)
     * @param cardsAttack
     */
    this.attack = function (cardsAttack) {

        console.log('cards attacked');
        console.log(cardsAttack);
        $validate = this.validateAttackCards(cardsAttack);

        if ($validate === true) {

            var game = this;
            var playerAttack = this.attacker;

            cardsAttack.forEach(function (cardAttack) {

                var aCard = null;
                var i = 0;

                playerAttack.cards.forEach(function (card) { // extra validation that attacking cards belong to attacker
                    if (card.rank == cardAttack.rank && card.shape == cardAttack.shape) {
                        aCard = playerAttack.cards.splice(i, 1)[0];
                        return;
                    }
                    i++;
                });

                if (aCard != null) {
                    game.board.cardsAttack.push(aCard);
                }
            });
        }
        else throw $validate;
    }

    /**
     * get max cards a player can attack with. not more than 6 unless bita is empty and then it's 5. max defender cards
     * taken in count before all
     * @returns {*}
     */
    this.getMaxCardsToAttack = function() {

        if (this.bita.length == 0) {
            if (this.defender.cards.length < DurakConfig.get('MAX_BOARD_CARDS_ATTACK_BEFORE_FIRST_BITA')) {
                return this.defender.cards.length;
            }else {
                return DurakConfig.get('MAX_BOARD_CARDS_ATTACK_BEFORE_FIRST_BITA');
            }
        } else {

            if (this.defender.cards.length < DurakConfig.get('MAX_BOARD_CARDS_ATTACK')) {
                return this.defender.cards.length;
            }else {
                return DurakConfig.get('MAX_BOARD_CARDS_ATTACK');
            }
        }

    };

    this.checkCardsBelongToPlayer = function(cards,player) {
        var foundNone = false;
        cards.forEach(function (card) {
            var found = false;
            player.cards.forEach(function(cardPlayer){
                if (card.rank == cardPlayer.rank && card.shape == cardPlayer.shape) {
                    found = true;
                }
            });
            if (!found) {
                foundNone = true;
            }
        });

        return !foundNone ? true : false;

    }

    /**
     * validate attack cards: same rank and defender has at least the rank of attacking cards
     * if board not empty, attacker cannot attack with cards that weren't played
     * @param cardsAttack
     * @returns {boolean|string}
     */
    this.validateAttackCards = function(cardsAttack) {

        var game = this;
        var error = null;

        if (!this.checkCardsBelongToPlayer(cardsAttack,game.attacker)){
            error = 'one or more cards not found for attacker!';
        }

        if (error)
            return error;

        // no attack cards in board
        if (game.board.cardsAttack.length == 0) {
            var attackNumber = null;
            var attackShape  = null;

            // check that attacking cards don't exceed limit
            if (cardsAttack.length > this.getMaxCardsToAttack()) {
                error = "attacking cards exceeded limit " + this.getMaxCardsToAttack();
            } else if (cardsAttack.length == 1) {
                return true;
            } else { // check all attacking cards are equal in rank and not equal in shape
                cardsAttack.forEach(function(cardAttack){
                    if (!attackNumber && !attackShape) {
                        attackNumber = cardAttack.rank;
                        attackShape = cardAttack.shape;
                    } else {
                        if (cardAttack.rank != attackNumber) {
                            error = 'attacking cards not equal in rank';
                        }

                        if (cardAttack.shape == attackShape) {
                            error = 'attacking cards has same shape';
                        }
                    }
                });
            }

        }else { // if we're here it means it's re-attacking

            // check defender has enough cards to defend with
            if (game.defender.cards.length < cardsAttack.length) {
                error = "defender has less cards than the attacking cards";
            }
            // first check we don't exceed limit
            else if ( (cardsAttack.length + game.board.cardsAttack.length) > this.getMaxCardsToAttack()) {
                error = "attacking cards exceeded limit " + this.getMaxCardsToAttack();
            } else {
                // check that attacking cards exist in board
                var allCardsPlayed = game.board.cardsAttack.concat(game.board.cardsDefense);

                cardsAttack.forEach(function(cardAttack){
                    var found = false;
                    allCardsPlayed.forEach(function(cardPlayed){
                        if (cardPlayed.rank === cardAttack.rank) {
                            found = true;
                        }
                    });
                    if (!found)
                        error = "card doesn't exist in board";
                });
            }
        }

        return error ? error : true;
    }


    this.defense = function(dCards,position,onlyShowCard) {

        var game = this;
        var error = null;

        if (!game.board.cardsAttack.length) {
            error = 'no attacking cards';
        }

        else if (!this.checkCardsBelongToPlayer(dCards,game.defender)){
            error = 'one or more cards not found for defender!';
        }else if (onlyShowCard) {
            if (dCards[0].shape != game.kozar.shape){
                error = 'cannot reveal  non trump card';
            }
        }

        if (error) throw error;

        // defender try to shift attack..validation is needed, change holders of cards and attack with defender
        if (game.board.cardsDefense.length === 0 && position === -1) {

            var foundSameRank = true;
            dCards.forEach(function(dCard){
                game.board.cardsAttack.forEach(function(aCard){
                    if (dCard.rank != aCard.rank) {
                        foundSameRank = false;
                    }
                });
            });

            if (foundSameRank) {
                // we change attacker, defender, add defend card to attacking cards in board;
                if (!onlyShowCard) {
                    dCards.forEach(function(dCard){
                        game.board.cardsAttack.push(dCard);
                        game.defender.omitCard(dCard);
                    });
                }

                game.board.cardsAttack.forEach(function(cardAttack){
                    cardAttack.holder = game.defender.name;
                });

                game.attacker = game.defender;
                game.defender = game.playerToRightOf(game.defender);
            }
        }else if(position >= 0 && dCards.length == 1 ) {
            aCard = game.board.cardsAttack[position];

            if (!game.isDefenseCardWins(aCard,dCards[0]))
                throw 'attacking card is ranked higher';

            game.board.cardsDefense.push(dCards[0]);
            game.defender.omitCard(dCards[0]);

        }
    }

    this.playerToRightOf = function (player) {
        var game = this;
        for (i=0; i< game.players.length; i++) {
            if (game.players[i].name === player.name ) {
                if (typeof game.players[i+1] != 'undefined') {
                    return (game.players[i+1]);
                }else{
                    return (game.players[0]);
                }
            }
        }
        return false;
    }

    this.endRound = function(result) {

        var game = this;

        if (result === DurakConfig.get('END_ROUND_BITA')) {
            //all board goes to bita package
            this.board.cardsDefense.concat(this.board.cardsAttack).forEach(function(bCard){
                game.bita.push(bCard);
            });

            game.board.cardsAttack = [];
            game.board.cardsDefense = [];

        }else { // defender takes all cards..!
            this.board.cardsDefense.concat(this.board.cardsAttack).forEach(function(bCard){
                game.defender.cards.push(bCard);
            });

        }
        // DRAFT CARDS

        // first player to draft cards will be the attacker
        var j = game.getPlayerByName(this.attacker.name,true).position;
        for (i=0 ; i< this.players.length ; i++){
            var player = this.players[j];
            if (player.name != this.defender.name) {
                this.package.draft(DurakConfig.get('CARDS_PER_PLAYER') - player.cards.length,player);
            }
            if (j === this.players.length){
                j = 0; // start from the beginning
            }
        }
        // last player to draft is the defender
        this.package.draft(DurakConfig.get('CARDS_PER_PLAYER') - this.defender.cards.length,this.defender);

        // CHANGE ATTACKER/DEFENDER
        if (result == DurakConfig.get('END_ROUND_BITA')){
            this.attacker = this.defender;
            this.defender = this.playerToRightOf(this.defender);
        }else{
            this.attacker = this.playerToRightOf(this.defender);
            this.defender = this.playerToRightOf(this.attacker);
        }

    }

    this.isDefenseCardWins = function (aCard, dCard) {
        // defense is not Kozar => attack must be non-kozar , attack is kozar ==> defense must be kozar as well
        if ( dCard.shape === aCard.shape ){
            aPriority = DurakConfig.cardPriority(aCard.rank);
            dPriority = DurakConfig.cardPriority(dCard.rank);
            if (dPriority > aPriority)
                return true;
        } else {  // defense must be a kozar
            if (dCard.shape === this.kozar.shape ) {
                return true;
            }
        }

        return false;
    }

    // test test.js case, override package and players cards
    this.initTest = function() {

        var game = this;
        this.package.cards = [];
        testCards.package.forEach(function(packageCard){
            game.package.cards.push(new Card(packageCard.rank,packageCard.shape,null));
            if (packageCard.kozar) {
                game.kozar = new Card(packageCard.rank,packageCard.shape,null);
            }
        });

        testCards.players.forEach(function(testPlayer){
            var gamePlayer = game.getPlayerByName(testPlayer.name);
            gamePlayer.cards = [];
            testPlayer.cards.forEach(function(playerCard){
                gamePlayer.cards.push(new Card(playerCard.rank,playerCard.shape,testPlayer.name));
            });
        });


    }

}



/***************************************
 *            TEST ZONE !              *
 ***************************************/


function test() {
    game = new Game();
    game.package =  new Package(6);
    game.package.init();
    game.addPlayer(new Player('yuval'));
    game.addPlayer(new Player('keren'));
    game.addPlayer(new Player('alon'));
    game.init();
    game.initTest();
    game.attack([ new Card('10','heart','yuval')]);
    game.defense([new Card('10','diamond','keren')],-1,true);
    game.defense([new Card('10', "club",'alon')],-1);
    game.defense([new Card('J','heart','yuval')],0);
    game.defense([new Card('Q','club','yuval')],1);
    game.attack([new Card('J','spade','alon')]);
    game.defense([new Card('Q','diamond','yuval')],2);
    game.endRound(DurakConfig.get('END_ROUND_BITA'));
}


