export default class BIButton extends HTMLElement {
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
          appearance: none;
          background: #1a1a1a;
          border: solid 1px transparent;
          border-radius: 8px;
          box-sizing: border-box;
          color: #f4f4f4;
          cursor: pointer;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
          margin: 0;
          outline: none;
          padding: 7px 16px 7px 16px;          
          width: 100%;
        }

        button:focus {
          border-color: purple;
          box-shadow: 0 0 0 3px color-mix( in srgb, purple 25%, transparent );          
        }        
      </style>
      <button type="button"></button>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
  }

   // When attributes change
  _render() {
    this.$button.innerText = this.label === null ? '' : this.label;
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
    this._render();
  }
  
  // Watched attributes
  static get observedAttributes() {
    return [
      'label'
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
}

window.customElements.define( 'bi-button', BIButton );
