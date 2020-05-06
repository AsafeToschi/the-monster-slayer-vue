new Vue({
    el: '#app',
    data: {
        hero: {

            status: {

                level: 1,
                maxHealth: 100,
                health: 100,
                maxMana: 50,
                mana: 50,
                speed: 1,

            },
            enemyTarget: "monster"

        },
        monster: {

            status: {

                level: 1,
                maxHealth: 75,
                health: 75,
                maxMana: 30,
                mana: 30,
                speed: 0.75,

            },
            enemyTarget: "hero"

        },
        turn: "hero",
        nextTurns: [],

    },
    computed: {

    },
    methods: {
        endBattle: function (dead) {

            if (dead == 'hero') {
                $('#lose').modal({
                    show: true,
                    backdrop: 'static'
                })
            } else if (dead == 'monster') {
                $('#win').modal({
                    show: true,
                    backdrop: 'static'
                })
            }

        },


        restartGame: function () {        
            this.hero.status.health = this.hero.status.maxHealth
            this.hero.status.mana = this.hero.status.maxMana

            this.monster.status.health = this.monster.status.maxHealth
            this.monster.status.mana = this.monster.status.maxMana
        },


        // turns: function () {
        //     heroSpeed = 0
        //     monsterSpeed = 0
        //     for (let i = 0; this.nextTurns.length < 30; i++) {
        //     // for (let i = 0; i < 10; i++) {


        //         if (heroSpeed > monsterSpeed && heroSpeed >= 1) {
        //             this.nextTurns.push("hero")
        //             heroSpeed--

        //         }
        //         if (monsterSpeed > heroSpeed && monsterSpeed >= 1) {
        //             this.nextTurns.push("monster")
        //             monsterSpeed--

        //         }
        //         console.log("Hero speed: " + heroSpeed)
        //         console.log("Monster speed: " + monsterSpeed)
        //         heroSpeed += this.hero.status.speed
        //         monsterSpeed += this.monster.status.speed

        //     }
        //     return console.log(this.nextTurns)
        // },

        healthBar: function (character) {

            maxHealth = this[character].status.maxHealth
            health = this[character].status.health

            if (health > maxHealth) {
                this[character].status.health = maxHealth
                health = maxHealth
            }

            if (this[character].status.health == 0) {
                this.endBattle(character)
            }

            if (health <= 0) {
                barWidth = 0
                this[character].status.health = 0
            } else {
                barWidth = (health / maxHealth) * 100

            }

            return {
                width: barWidth + "%"
            }
        },


        manaBar: function (character) {

            maxMana = this[character].status.maxMana
            mana = this[character].status.mana

            if (mana <= 0) {
                barWidth = 0
                this[character].status.mana = 0
            } else {
                barWidth = (mana / maxMana) * 100
            }

            return {
                width: barWidth + "%"
            }

        },

        monsterAction: function () {

            // action = Math.round(Math.random() * (2 - 1)) + 1
            action = 1

            if (action == 1) {
                this.attack('monster')
            }

        },


        attack: function (character) {

            enemyTarget = this[character].enemyTarget
            this[enemyTarget].status.health -= 30

            $("#" + enemyTarget).effect("shake", {
                distance: 5
            })

        },


        heal: function (character, cost) {

            if (this[character].status.mana >= cost) {

                this[character].status.mana -= cost
                heal = this[character].status.maxHealth * (30 / 100)

                this[character].status.health += heal

            }

        }
    },
})
