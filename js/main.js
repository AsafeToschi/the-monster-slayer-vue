teste = new Vue({
    el: '#app',
    data: {
        hero: {

            status: {

                level: 1,
                maxHealth: 500,
                health: 500,
                maxMana: 150,
                mana: 150,
                baseSpeed: 1,
                speed: 1,
                minDamage: 70,
                maxDamage: 100
                
            },
            abilities: {

                heal: 25,
                healCost: 75

            },
            enemyTarget: "monster"

        },
        monster: {

            status: {

                level: 1,
                maxHealth: 450,
                health: 450,
                maxMana: 175,
                mana: 175,
                baseSpeed: 0.75,
                speed: 0.75,
                minDamage: 80,
                maxDamage: 110

            },
            abilities: {

                heal: 30,
                healCost: 75

            },
            enemyTarget: "hero"

        },
        activeTurn: "hero",
        battleLog: [],
        hasBattleLog: false,

    },
    computed: {

    },
    methods: {
        nextTurn: function (activeTurn) {

            if (activeTurn == 'hero') {
                this.activeTurn = 'monster'
                setTimeout(() => {
                    this.monsterAction()
                }, 700)

            } else if (activeTurn == 'monster') {
                setTimeout(() => {
                    this.activeTurn = 'hero'
                }, 800)

            }

        },


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


        attack: function (character) {
            if (this.activeTurn == character && this[character].status.health > 0) {

                enemyTarget = this[character].enemyTarget

                minDamage = this[character].status.minDamage
                maxDamage = this[character].status.maxDamage
                damage = Math.round(Math.random() * (maxDamage - minDamage)) + minDamage

                this[enemyTarget].status.health -= damage
                $("#" + enemyTarget).effect("shake", {
                    distance: 5
                })

                this.battleLog.unshift({
                    character,
                    text: "The " + character + " deals " + damage + " DMG to the " + enemyTarget
                })
                this.hasBattleLog = true

                this.nextTurn(character)
            }
        },


        heal: function (character, manaCost) {
            if (this.activeTurn == character) {

                healPercent = this[character].abilities.heal
                manaCost = this[character].abilities.healCost

                if (this[character].status.mana >= manaCost) {

                    this[character].status.mana -= manaCost
                    heal = this[character].status.maxHealth * (healPercent / 100)
                    this[character].status.health += heal


                    this.battleLog.unshift({
                        character,
                        text: "The " + character + " heals itself by " + heal + " HP"
                    })
                    this.hasBattleLog = true

                    this.nextTurn(character)

                }
            }

        },


        monsterAction: function () {

            health = this.monster.status.health
            maxEnemyDamage = this.hero.status.maxDamage

            mana = this.monster.status.mana
            healCost = this.monster.abilities.healCost

            if (health <= maxEnemyDamage && mana >= healCost) {
                maxDamage = this.monster.status.maxDamage
                enemyHealth = this.hero.status.health
                if (enemyHealth <= maxDamage) {
                    action = 'attack'

                } else {
                    action = 'heal'

                }

            } else {
                action = 'attack'
            }

            if (action == 'attack') {
                this.attack('monster')
            }
            if (action == 'heal') {
                this.heal('monster')
            }
        },


        endBattle: function (dead) {

            setTimeout(() => {

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

            }, 500)

        },


        restartGame: function () {
            setTimeout(() => {
                this.activeTurn = 'hero'
                this.battleLog = []
                this.hasBattleLog = false

                this.hero.status.health = this.hero.status.maxHealth
                this.hero.status.mana = this.hero.status.maxMana

                this.monster.status.health = this.monster.status.maxHealth
                this.monster.status.mana = this.monster.status.maxMana

            }, 500)
        },
    },
})
