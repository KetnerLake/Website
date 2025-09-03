export default class KetnerLakeCarousel extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
        }

        div[part=images] {
          border-radius: 12px;          
          box-sizing: border-box;
          position: relative;
          min-height: var( --carousel-height, 600px );          
          overflow: hidden;          
          width: var( --carousel-width, 300px );          
        }

        ul {
          display: flex;
          flex-direction: row;
          gap: 16px;
          margin: 0;
          padding: 0;
        }

        ul li {
          background: #ffffff;
          border-radius: 12px;
          box-sizing: border-box;
          display: inline-block;
          height: 24px;          
          margin: 0;
          opacity: 0.40;
          padding: 0;
          transition-duration: var( --carousel-transition, 2s );
          transition-property: opacity;
          transition-timing-function: ease-in-out;
          width: 24px;          
        }

        ul li.selected {
          opacity: 1.0;
        }

        :host( [hide-picker] ) ul {
          display: none;
        }

        ::slotted( img ) {
          left: 0;
          position: absolute;
          top: 0;
          transition-duration: var( --carousel-transition, 2s );
          transition-property: opacity;
          transition-timing-function: ease-in-out;
          width: var( --carousel-width, 300px );
        }
      </style>
      <div part="images">
        <slot></slot>
      </div>
      <ul></ul>
    `;

    // Events
    this.onItemClick = this.onItemClick.bind( this );

    // Private
    this._interval = null;
    this._index = 0;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$list = this.shadowRoot.querySelector( 'ul' );
    this.$slot = this.shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchange', () => {
      while( this.$list.children.length > this.children.length ) {
        this.$list.children[0].removeEventListener( 'click', this.onItemClick );
        this.$list.children[0].remove();
      }

      while( this.$list.children.length < this.children.length ) {
        const item = document.createElement( 'li' );
        item.addEventListener( 'click', this.onItemClick );
        this.$list.appendChild( item );
      }

      for( let c = 0; c < this.$list.children.length; c++ ) {
        this.$list.children[c].setAttribute( 'data-index', c );
      }
    } );
  }

  start() {
    if( this._interval !== null ) this.stop();

    const duration = this.duration === null ? 6000 : this.duration;

    this._interval = setInterval( () => {
      if( this._index === this.children.length - 1 ) {
        this._index = 0;
      } else {
        this._index = this._index + 1;
      }

      for( let c = 0; c < this.children.length; c++ ) {
        if( c === this._index ) {
          this.children[c].style.opacity = 1.0;
          this.$list.children[c].classList.add( 'selected' );
        } else {
          this.children[c].style.opacity = 0;
          this.$list.children[c].classList.remove( 'selected' );          
        }
      }
    }, duration );    
  }

  stop() {
    clearInterval( this._interval );
    this._interval = null;
    this._index = 0;
  }

  onItemClick( evt ) {
    this.stop();

    this._index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );
    
    for( let c = 0; c < this.children.length; c++ ) {
      if( c === this._index ) {
        this.children[c].style.opacity = 1.0;
        this.$list.children[c].classList.add( 'selected' );
      } else {
        this.children[c].style.opacity = 0;
        this.$list.children[c].classList.remove( 'selected' );          
      }
    }

    this.start();
  }

  // When attributes change
  _render() {
    if( this._interval === null ) this.start();
  }

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Setup
  connectedCallback() {
    this._upgrade( 'duration' );    
    this._upgrade( 'hidePicker' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'duration',
      'hide-picker'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get duration() {
    if( this.hasAttribute( 'duration' ) ) {
      return parseInt( this.getAttribute( 'duration' ) );
    }

    return null;
  }

  set duration( value ) {
    if( value !== null ) {
      this.setAttribute( 'duration', value );
    } else {
      this.removeAttribute( 'duration' );
    }
  }

  get hidePicker() {
    return this.hasAttribute( 'hide-picker' );
  }

  set hidePicker( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hide-picker' );
      } else {
        this.setAttribute( 'hide-picker', '' );
      }
    } else {
      this.removeAttribute( 'hide-picker' );
    }
  }  
}

window.customElements.define( 'lake-carousel', KetnerLakeCarousel );
