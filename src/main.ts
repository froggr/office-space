/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

const arcadeGames = [
    {name: 'pooltable', site:'https://bloob.io/8ballpool/'},
    {name: 'duckhunt', site:'https://duckhuntjs.com/'},
    {name: 'snesparty', site:'https://app.kosmi.io/room/r0bqoh'},
    {name: 'mario', site:'https://www.retrogames.cc/embed/42845-super-mario-all-stars-nes.html'},
    {name: 'doom', site:'https://en.gameslol.net/data/dosbox/index.php?url=doom.zip'},
    {name: 'tmnt', site:''}
]

let currentGame: any = null;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    

    for(let game of arcadeGames) {
        WA.room.area.onEnter(`${game.name}`).subscribe(async () => {
            
            currentGame = await WA.ui.website.open({
                url: game.site,
                position: {
                    vertical: "middle",
                    horizontal: "middle",
                },
                size: {
                    height: "90vh",
                    width: "90vw",
                },
            });
            currentGame.position.vertical = "top";

        })
        WA.room.area.onLeave(`${game.name}`).subscribe(()=>{
            if(currentGame)currentGame.close()
        });
    }


    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
