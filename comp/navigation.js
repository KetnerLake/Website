export default class HoytNavigation extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          background: rgba( 255, 255, 255, 0.95 );
          backdrop-filter: blur( 10px );
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: box-shadow 0.30s ease-in-out;
        }

        body {
          background: #ffffff;
        }

        button {
          appearance: none;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;          
          display: flex;
          height: 40px;
          display: none;
          justify-content: center;
          margin: 0;
          outline: none;
          position: relative;
          padding: 0;
          width: 40px;
        }

        button svg {
          height: 24px;
          position: absolute;
          transform: translate( -12px, -12px );
          transition: opacity 0.15s ease-in-out;
          width: 24px;
        }

        button svg:first-of-type {
          opacity: 1.0;
        }

        button svg:last-of-type {
          opacity: 0;
        }        

        button.open svg:first-of-type {
          opacity: 0;
        }

        button.open svg:last-of-type {
          opacity: 1.0;
        }        

        div {
          align-items: center;
          display: flex;
          flex-basis: 0;
          flex-direction: row;
          flex-grow: 1;
          gap: 16px;
          justify-content: flex-end;
          padding: 0 16px 0 0;
        }

        div[part=column] {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          max-width: var( --column-width );
          padding: 16px;
          position: relative;
          width: 100%;
        }

        a,
        h1 {
          color: var( --secondary-text );
          font-family: 'Open Sans', sans-serif;
          font-size: 24px;
          font-weight: 700;
          line-height: 40px;
          margin: 0;
          padding: 0;
          text-decoration: none;
          transition: color 0.15s ease-in-out;
        }     

        a:hover {
          color: var( --gradient-start );
        }

        @media( max-width: 768px ) {
          button {
            display: inline-block;
          }

          div[part=menu] {
            background: #ffffff;
            flex-direction: column;
            height: 0;
            left: 0;
            opacity: 0;
            overflow: hidden;
            padding: 16px 0 16px 0;
            position: absolute;
            top: 88px;
            transition: opacity 0.15s ease-in-out, height 0.15s ease-in-out;
            right: 0;            
          }

          div.open {
            background: #ffffff;
            flex-direction: column;
            height: 152px;
            left: 0;
            opacity: 1.0;
            padding: 16px 0 16px 0;
            position: absolute;
            top: 88px;
            right: 0;
          }

          h1 {
            flex-basis: 0;
            flex-grow: 1;
          }
        }        
      </style>
      <div part="column">
        <button type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"/>
          </svg>        
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/>
          </svg>          
        </button>
        <h1>
          <a></a>
        </h1>
        <div part="menu">
          <slot></slot>
        </div>
        <slot name="action"></slot>
      </div>
    `;

    // Events
    this.onDocumentClick = this.onDocumentClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'click', ( evt ) => {
      evt.stopPropagation();

      this.$button.classList.toggle( 'open' );
      this.$menu.classList.toggle( 'open' );
    } );
    this.$menu = this.shadowRoot.querySelector( 'div[part=menu]' );
    this.$title = this.shadowRoot.querySelector( 'a' );    

    document.addEventListener( 'click', this.onDocumentClick );      
    
    window.addEventListener( 'scroll', () => {
      if( window.scrollY > 80 ) {
        this.style.boxShadow = '0 2px 20px rgba( 0, 0, 0, 0.10 )';
      } else {
        this.style.boxShadow = 'none';
      }
    } )
  }

  onDocumentClick( evt ) {
    if( !this.$button.contains( evt.target ) && !this.$menu.contains( evt.target ) ) {
      this.$button.classList.remove( 'open' );
      this.$menu.classList.remove( 'open' );      
    }    
  }

  // When attributes change
  _render() {
    this.$title.href = this.href === null ? '' : this.href;
    this.$title.textContent = this.title === null ? '' : this.title;
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
    this._upgrade( 'href' );          
    this._upgrade( 'title' );      
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'href',
      'title'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Attributes
  // Reflected
  // Boolean, Float, Integer, String, null  
  get href() {
    if( this.hasAttribute( 'href' ) ) {
      return this.getAttribute( 'href' );
    }

    return null;
  }

  set href( value ) {
    if( value !== null ) {
      this.setAttribute( 'href', value );
    } else {
      this.removeAttribute( 'href' );
    }
  }

  get title() {
    if( this.hasAttribute( 'title' ) ) {
      return this.getAttribute( 'title' );
    }

    return null;
  }

  set title( value ) {
    if( value !== null ) {
      this.setAttribute( 'title', value );
    } else {
      this.removeAttribute( 'title' );
    }
  }  
}

window.customElements.define( 'krh-navigation', HoytNavigation );
