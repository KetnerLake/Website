export default class HoytInput extends HTMLElement {
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

        input {
          appearance: none;
          background: #ffffff;
          border: 2px solid #e2e8f0;          
          border-radius: 8px;  
          box-sizing: border-box;                  
          color: var( --primary-text );
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          height: 48px;
          line-height: 24px;
          margin: 0;
          outline: none;
          padding: 0 12px 0 12px;
          transition: 
            border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
          width: 100%;
        }

        input:focus {
          border-color: var( --gradient-start );
          box-shadow: 0 0 0 3px rgba( 79, 70, 229, 0.10 );
        }

        p {
          color: var( --primary-text );
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 8px 0;
        }

        p span:last-of-type {
          color: #ef4444;
        }

        :host( :not( [required] ) ) p span:last-of-type {
          display: none;
        }
      </style>
      <label>
        <p>
          <span></span>
          <span>*</span>
        </p>
        <input type="text" />
      </label>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'input', () => {
      this.value = this.$input.value.trim().length === 0 ? null : this.$input.value;
    } );
    this.$label = this.shadowRoot.querySelector( 'p span:first-of-type' );    
  }

  focus() {
    this.$input.focus();
  }

  // When attributes change
  _render() {
    this.$label.textContent = this.label === null ? '' : this.label;
    this.$input.value = this.value;
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
    this._upgrade( 'required' );              
    this._upgrade( 'value' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'label',
      'required',
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
  // Boolean, Number, String, null
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

  get required() {
    return this.hasAttribute( 'required' );
  }

  set required( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'required' );
      } else {
        this.setAttribute( 'required', '' );
      }
    } else {
      this.removeAttribute( 'required' );
    }
  }   

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( content ) {
    if( content !== null ) {
      this.setAttribute( 'value', content );
    } else {
      this.removeAttribute( 'value' );
    }
  }
}

window.customElements.define( 'krh-input', HoytInput );
