# Mia Bot
This is still in development.

# Road Map

- [] Music Module

# FAQ
## Can I copy your code?
Yes, but I ask that you don't copy the entire project. ^-^

## Why are you using an object for the Creator and Handler?
Well I used to do classes for them, but I didn't like how it looked. So I changed it to be an Object.

## Why did you make a Logger class for your logger package?
The idea I have for this bot is to be completely modular! Lets say that winston (The current logger package I am using) is deprecated, or I find a better logger package. I would have to go through each file and replace winston to the new logger package. That is really time-consuming. So instead I made a class and used that class through out the project, and if I need to switch packages I can just change the class, and I will be done.

I did the same thing with the music package. If at any point that discord-player (The current music package) ends up failing me or isn't compatible with my hosting service, then I can replace it super easily!