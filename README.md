# Drill-Writing
## Note from the creator
This is a project I created towards the end of Summer 2020. The idea was to have a marching band show despite quarantine, where one of my friends would write the music and I would write the drill.

This program is designed to aid in the drill-writing process as the drill-writing software available on the internet was either too expensive or not what I was looking for. The main concept of the program is it is a tool to be used to write and print drill for marching band members so that it does not need to be done by hand.


## Main Features
### Players
The user can add a player by clicking the "Add New Player" button and selecting what instrument they play. Newly created players will appear in the top left corner of the field, and they can be dragged around to their proper place on the field. The player that is selected will turn red, and the location of that player will both be stored in the local memory and shown at the bottom of the field.

### Sets
In marching band, different players need to be in different locations over time, and each time their locations is marked are called a "set". The current Set number is listed below the bottom left corner of the field, and can be adjusted using the "Previous Set" and "Next Set" buttons. Each player has a different location stored for each set, and these can be adjusted in each set. By default, going to a set number higher than the highest stored will create a set indentical to the previous set.

### Shows
I had originally intended to add code to allow for the creation of multiple shows stored withing the same computer, but this did not get implemented, only 1 show is ever used, with some code allowing for the potential addition of future shows

## Extra Features (Bottom of the Screen)
### 6 Feet Apart
With COVID-19 concerns in mind, I did the calculations for how far 6 feet apart would be, and any time 2 players are closer than 6 feet to each other in a set they will be highlighted in orange.

### Distance from Previous Set
Clicking either the button reffering to distance form the last set will create a gradient line connecting the player's current location to their location in the previous set. This only works if a. the set number is greater than 1 and b. the player selected has moved from the previous set. This is intended to both help check if it is an unreasonable distance to travel for 1 set and to check if any players will be in the same location at the same time.

### Print Mode
This removes all the buttons and shows the field in a way that could easily be printed. I had intended to use screen captures from this mode to print the set, as this does not link to any real printing options.


## Final Note
Recently I realized there were a few errors preventing the program from working properly the way it was posted on GitHub, so I fixed those errors. However, as I only intended the projected for private use, I most likely will not be returning to finish the project the way I originally had in mind as I am no longer in need of drill writing software.