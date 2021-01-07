# flocking-birds-background

An interactive and animated flocking birds background for React. 

This background supports window resizing, horizontal and vertical scrolling, and defining custom obstacles through the use of CSS selectors. User interactivity is included with birds within a proximity being attracted to the mouse's position when the mouse is over the background

## Installation

The background is provided as a NPM package, so to install run `npm install flocking-birds-background` in the root of your React project.

## Usage

To use, import the background component and place this within the main `App` div of your app:
```
import { FlockingBirdsBackground } from 'flocking-birds-background'

function App() {
  return (
    <div className="App">
      <FlockingBirdsBackground/>
    </div>
  );
}
```

An initial number of birds can be chosen by setting the `initialBirdCount` prop (this defaults to 150):
```
<FlockingBirdsBackground initialBirdCount={100}/>
```

Currently to mark elements as an obstacle which the birds will avoid, give the element a class name of `avoider`. (A future update will make the CSS selector configurable)

## Credits

The behavioural model for the birds has been based off the work done in modelling the movement of starling flocks by Daniel J. G. Pearcea, Adam M. Millera, George Rowlandsa, and Matthew S. Turner at the University of Warwick.

See the following article for more details: https://warwick.ac.uk/newsandevents/pressreleases/the_mystery_behind

## License

Distributed under the MIT License. See LICENSE for more information.

## Contact

- Thomas Dove (CasulOrnstein) - https://github.com/CasulOrnstein
- James Ellis (Jamespellis2) - https://github.com/Jamespellis2
