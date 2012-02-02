# Keloran's bbCode Editor #
This is my bbCode editor that has live replacement of certain things
as used in Hammer Framework, so you can see whats actually going to display once submitted

this can also be used on any site really, its all javascript, so doesnt require Hammer

## Start it ##
$("#reply").bbCode({
    preview: true
});

this will update the textbox adding buttons, and a live preview on the side, 
when you type it will live grab the result and show you what it will look like

e.g. [b]bold[/b]
on the side will make <b>bold</b>
this is done inside a live div, so you only see a #### bold #### version of the text

## Whats not provided ##
I have not included a stylesheet, or any images with this, the main reason is becasue each
person likes things different, and it stops me falling foul of copyright issues

I recommend famfam's small images, they look nice and make sense for this kind of editor
