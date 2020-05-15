var gameApp = new Vue({
    el: '#app',
    data: {
        battle: true,
        map: false,
        hero: {
            status: {

                level: 1,
                maxHealth: 150,
                health: 150,
                maxMana: 50,
                mana: 50,
                attack: 10,
                baseSpeed: 10,
                speed: 10,
                dodge: 0,
                minDamage: 25,
                maxDamage: 40,
                critical: 5, // % chance
                criticalDamage: 150, // %
                defence: 10,
                damageReduction: 0, // atribuído dinamicamente

            },
            statusHUD: {
                line1: {

                    health: 0,
                    mana: 0,
                    attack: 0,
                    speed: 0,

                },
                line2: {

                    damage: 0,
                    defence: 0,
                    critical: "0%",
                    dodge: 0,

                }
            },
            statusDescriptionHUD: {
                health: "Health",
                mana: "Mana",
                attack: "Attack",
                speed: "Movement Speed",
                damage: "Weapon Damage",
                defence: "Defence",
                critical: "Critical Chance",
                dodge: "Dodge Chance",

            },
            abilities: {
                heal: {

                    percentRegen: 30,
                    healthRegen: 0,
                    healCost: 20,

                },

            },
            enemyTarget: "monster"

        },
        monster: {
            status: {

                level: 1,
                maxHealth: 150,
                health: 150,
                maxMana: 50,
                mana: 50,
                attack: 10,
                baseSpeed: 10,
                speed: 10,
                dodge: 0,
                minDamage: 25,
                maxDamage: 40,
                critical: 5, // % chance
                criticalDamage: 150, // %
                defence: 10,
                damageReduction: 0, // atribuído dinamicamente

            },
            statusHUD: {
                line1: {

                    health: 0,
                    mana: 0,
                    attack: 0,
                    speed: 0,

                },
                line2: {

                    damage: 0,
                    defence: 0,
                    critical: "0%",
                    dodge: 0,

                }
            },
            statusDescriptionHUD: {

                health: "Health",
                mana: "Mana",
                attack: "Attack",
                speed: "Movement Speed",
                damage: "Damage",
                defence: "Defence",
                critical: "Critical Chance",
                dodge: "Dodge Chance",

            },
            abilities: {
                heal: {

                    percentRegen: 30,
                    healthRegen: 0,
                    healCost: 20,
                    
                },

            },
            enemyTarget: "hero"

        },
        activeTurn: "hero",
        battleLog: [],
        rounds: [],
        thisRound: 0,
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
                this.thisRound++

            } else if (activeTurn == 'monster') {
                setTimeout(() => {
                    this.activeTurn = 'hero'
                }, 800)

            }
            this.rounds.unshift(this.thisRound)

        },


        setStatusHUD: function (character) {

            enemyTarget = this[character].enemyTarget

            this[character].statusHUD.line1.health = this[character].status.maxHealth
            this[character].statusHUD.line1.mana = this[character].status.maxMana
            this[character].statusHUD.line1.attack = this[character].status.attack
            this[character].statusHUD.line1.speed = this[character].status.speed
            
            // Damage
            if (this[character].status.minDamage == this[character].status.maxDamage) {
                this[character].statusHUD.line2.damage = this[character].status.minDamage
            } else {
                this[character].statusHUD.line2.damage = this[character].status.minDamage + "-" + this[character].status.maxDamage
            }
            if (this[character].status.critical > 100) {
                this[character].status.critical = 100
            }
            this[character].statusHUD.line2.critical = this[character].status.critical + "%"
            this[character].statusHUD.line2.defence = this[character].status.defence

            // Damage Reduction
            defence = this[character].status.defence
            attack = this[enemyTarget].status.attack

            if (defence >= 0) {
                damageReduction = (defence / ((attack * 3) + defence)) * (100 * -1)

            } else {
                damageReduction = (2 - (100 / (100 - defence))) 
                damageReduction = (damageReduction * 100) - 100

            }
            damageReduction = Math.round(parseFloat(damageReduction.toFixed(2)))
            if (damageReduction < 0) {
                this[character].statusDescriptionHUD.defence = "Defence (" + damageReduction + "% Damage)"
            }
            if (damageReduction >= 0) {
                this[character].statusDescriptionHUD.defence = "Defence (+" + damageReduction + "% Damage)"
            }
            this[character].status.damageReduction = damageReduction

            // Dodge Chance
            speed = this[character].status.speed
            enemySpeed = this[enemyTarget].status.speed

            dodgeChance = (speed / ((enemySpeed * 9) + speed)) * 100
            dodgeChance = Math.round(parseFloat(dodgeChance.toFixed(2)))

            this[character].statusHUD.line2.dodge = dodgeChance + "%"
            this[character].status.dodge = dodgeChance

            // Health Regen
            maxHealth = this[character].status.maxHealth
            percentRegen = this[character].abilities.heal.percentRegen
            this[character].abilities.heal.healthRegen = Math.round(maxHealth * (percentRegen / 100))



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

                // Dodge Chance
                dodgeChance = this[enemyTarget].status.dodge
                randomNum = Math.round(Math.random() * (100 - 1)) + 1

                if (randomNum <= dodgeChance) {
                    this.battleLog.unshift({
                        character,
                        text: "The " + character + " missed the attack!"
                    })

                } else {

                    // Damage
                    minDamage = this[character].status.minDamage
                    maxDamage = this[character].status.maxDamage
                    damage = Math.round(Math.random() * (maxDamage - minDamage)) + minDamage

                    // Will crit?
                    critical = false
                    criticalChance = this[character].status.critical
                    criticalDamage = this[character].status.criticalDamage
                    randomNum = Math.round(Math.random() * (100 - 1)) + 1

                    console.log("Normal damage: " + damage)
                    if (randomNum <= criticalChance) {
                        critical = true
                        damage = Math.round(damage * (criticalDamage / 100))
                        console.log("Critical Hit! Damage deal " + damage)

                    }

                    // apply defence | Damage Reduction
                    damageReduction = this[enemyTarget].status.damageReduction
                    damage = Math.round(damage * (1 - (-damageReduction / 100)))
                    console.log("Dano aplicando defesa:" + damage)


                    // apply damage
                    this[enemyTarget].status.health -= damage
                    $("#" + enemyTarget + " .health-bar").effect("shake", {
                        distance: 5
                    })

                    if (critical == true) {
                        this.battleLog.unshift({
                            character,
                            text: "CRITICAL HIT - The " + character + " deals " + damage + " DMG to the " + enemyTarget
                        })

                    } else {
                        this.battleLog.unshift({
                            character,
                            text: "The " + character + " deals " + damage + " DMG to the " + enemyTarget
                        })
                    }

                }
                if (this.battleLog.length > 0) {
                    this.hasBattleLog = true

                }

                this.nextTurn(character)
            }
        },


        heal: function (character, manaCost) {
            if (this.activeTurn == character && this[character].status.health > 0) {
                
                healthRegen = this[character].abilities.heal.healthRegen
                manaCost = this[character].abilities.heal.healCost

                if (this[character].status.mana >= manaCost) {

                    this[character].status.mana -= manaCost
                    
                    this[character].status.health += healthRegen


                    this.battleLog.unshift({
                        character,
                        text: "The " + character + " heals itself by " + healthRegen + " HP"
                    })
                    if (this.battleLog.length > 0) {
                        this.hasBattleLog = true

                    }

                    this.nextTurn(character)

                }
            }

        },


        monsterAction: function () {

            health = this.monster.status.health
            maxEnemyDamage = this.hero.status.maxDamage

            mana = this.monster.status.mana
            healCost = this.monster.abilities.heal.healCost

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

                this.monster.status.speed = this.monster.status.baseSpeed

            }, 500)
        },
    },
})


$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip()

    if ($(window).width() > 576) {

        pageHeight = $(window).outerHeight()
        marginY = 40
        elementsHeight = $("#heroAction").outerHeight(true) + $("#charactersStatus").outerHeight(true) + $("#titleGame").outerHeight(true) + (marginY * 2)
        $(".battle-info").css("max-height", pageHeight - elementsHeight)
        $(".battle-info").css("margin", marginY + "px 0px")
    }

})

