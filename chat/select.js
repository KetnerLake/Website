export default class BISelect extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
          width: 100%;
        }

        button {
          align-items: center;
          anchor-name: --bi-select-button;
          background: white;
          border: solid 1px grey;
          border-radius: 8px;
          box-sizing: border-box;
          color: #1a1a1a;
          cursor: pointer;
          display: flex;
          flex-basis: 0;
          flex-direction: row;
          flex-grow: 1;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 16px;
          line-height: 24px;
          margin: 0;
          min-width: 0;
          outline: none;
          padding: 7px 16px 7px 16px;      
          text-align: left;    
          width: 100%;
        }

        button:focus {
          border-color: purple;
          box-shadow: 0 0 0 3px color-mix( in srgb, purple 25%, transparent );          
        }

        button span {
          display: block;
        }

        button span:first-of-type {
          flex-basis: 0;
          flex-grow: 1;
        }

        button span:last-of-type {
          align-items: center;
          display: flex;
          height: 24px;
          justify-content: center;
          width: 24px;
        }

        p {
          color: #1a1a1a;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 16px;
          line-height: 24px;
          margin: 0;
          padding: 0 0 4px 0;
        }

        ul {
          background: white;
          border: solid 1px grey;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba( 0, 0, 0, 0.10 );
          box-sizing: border-box;
          left: anchor( left );
          list-style: none;
          margin: 4px 0 0 0;
          padding: 8px 0 8px 0;
          position: fixed;
          position-anchor: --bi-select-button;
          top: anchor( bottom );
          width: anchor-size( width );
        }
      </style>
      <p></p>
      <button popovertarget="list" type="button">
        <span></span>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>        
        </span>
      </button>
      <ul id="list" popover>
        <slot></slot>
      </ul>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'p' );
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$list = this.shadowRoot.querySelector( 'ul' );
    this.$slot = this.shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchange', () => {
      const options = this.querySelectorAll( 'bi-select-option' );
      const selected = Array.from( options ).find( ( element ) => element.hasAttribute( 'selected' ) );  
      this.$value.innerText = selected.getAttribute( 'label' );

      for( let c = 0; c < options.length; c++ ) {
        options[c].addEventListener( 'change', ( evt ) => {
          this.value = evt.target.value;

          this.$value.innerText = evt.target.label;
          this.$list.hidePopover();

          for( let c = 0; c < this.children.length; c++ ) {
            this.children[c].selected = evt.target === this.children[c] ? true : false;
          }
        } );
      }
    } );
    this.$value = this.shadowRoot.querySelector( 'button span:first-of-type' );
  }

   // When attributes change
  _render() {
    this.$label.innerText = this.label === null ? '' : this.label;
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
    this._upgrade( 'label' ); 
    this._upgrade( 'name' );     
    this._upgrade( 'value' );         
    this._render();
  }
  
  // Watched attributes
  static get observedAttributes() {
    return [
      'label',
      'name',
      'value'
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
  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }

  get name() {
    if( this.hasAttribute( 'name' ) ) {
      return this.getAttribute( 'name' );
    }

    return null;
  }

  set name( value ) {
    if( value !== null ) {
      this.setAttribute( 'name', value );
    } else {
      this.removeAttribute( 'name' );
    }
  }
  
  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( data ) {
    if( data !== null ) {
      this.setAttribute( 'value', data );
    } else {
      this.removeAttribute( 'value' );
    }
  }  
}

window.customElements.define( 'bi-select', BISelect );
