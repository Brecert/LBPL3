# Todo

- create a global "chip list"
	the chip list needs to be configurable on how it's displayed, what catagories the
	chips are catagorized by and other settings.

- create a chip list menu to add new chips

- make it so you can delete chips

- make chip connections global rather then within the class
	connections should work like
    ```js
    	[
    		id: {
    			from {
    				chip: id
    				input: id
    			}
    			to: {
    				chip: id
    				input: id
    			}
    		}
    	]
    
    	removeConnection() { 
    		// something sommething delete
    		// global.connections[3]
    		// ( no more connection )
    	}
    
    	// flaws
    	// getting any connection may be a pain
    ```

- make it so connections can be removed

- add better, less accurate bounds for ui,
	for example, making the output and input bounds larger to make it easier to drag and drop

- make the canvas rendering follow the css rules

- chips should have a display config for displaying icons, input and output position,
	color, and other rendering settings

- chip rendering should be a little more self contained