export default class BISelectOption extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          position: relative;
        }

        button {
          align-items: center;
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          color: #1a1a1a;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 16px;
          line-height: 24px;
          margin: 0;
          outline: none;
          padding: 8px 16px 8px 16px;          
          text-align: left;
          width: 100%;
        }

        button:hover {
          background: #f4f4f4;
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

        :host( :not( [selected] ) ) button span:last-of-type {
          display: none;
        }
      </style>
      <button type="button">
        <span></span>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/></svg>
        </span>
      </button>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'click', () => {
      this.dispatchEvent( new CustomEvent( 'change' ) );
    } );
    this.$label = this.shadowRoot.querySelector( 'button span:first-of-type' );
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
    this._upgrade( 'selected' );     
    this._upgrade( 'value' );     
    this._render();
  }
  
  // Watched attributes
  static get observedAttributes() {
    return [
      'label',
      'selected',
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

  get selected() {
    return this.hasAttribute( 'selected' );
  }

  set selected( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selected' );
      } else {
        this.setAttribute( 'selected', '' );
      }
    } else {
      this.removeAttribute( 'selected' );
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

window.customElements.define( 'bi-select-option', BISelectOption );
