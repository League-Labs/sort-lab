# SortLab

A TypeScript library for creating interactive sorting algorithm visualizations
in web applications.

The single code file, `SortDemo.js`, contains an API for building sorting
algorithms with operations like `compare`, `swap`, `shift`, and `insert`. It
also includes a simple UI with buttons for starting, stopping, and resetting the
visualization, as well as sliders for adjusting the number of elements and
animation  speed. Using the api functions will automatically update the UI.

## Setup

You will need to have node and npm installed, then run `npm install`

## Implementing Sort Routines

The `SortDemo` class has these methods that you can use to implement your sort routine: 

* `this.compare(i, j)`
* `this.swap(i, j)`
* `this.move(i,j)`

Here is an implementation of a bubble sort:

```typescript
  async bubbleSort(n: number) {
    let i: number = 0
    let j: number = 0

    for (i = 0; i < n - 1; i++) {
      for (j = 0; j < n - i - 1; j++) {
        
        if (this.compare(j, j + 1) > 0) {
          await this.swap(j, j + 1);
        
        }
      }
      // Mark the largest element as sorted after each pass
      this.markSorted(j);
    }

  }
```

To create your own sort routine: 

1) Create a new sort routine at the end of the `SortDemo.ts` ( Not .`.js`! )
2) Update `private algorithms: Algorithm[]` with information about your sort routine
3) Run `npm run build` to build your code. 
4) Run `npm run dev` to start the server

Instead of (3) and (4) you can also run `npm run dev:watch` and the development
server will automatically watch for changes, rebuild, and keep the server running.

## Playfield Setup Options

The "New" button includes a dropdown menu with different initialization options:

* Random - Creates a playfield with randomly ordered elements (default)
* Sorted Down - Creates a playfield with elements sorted in descending order
* Sorted Up - Creates a playfield with elements sorted in ascending order

