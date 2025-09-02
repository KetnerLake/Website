export default class HoytSelect extends HTMLElement {
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

        select {
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

        select:focus {
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
        <select></select>
      </label>
    `;

    // Private 
    this._options = [];

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$select = this.shadowRoot.querySelector( 'select' );
    this.$select.addEventListener( 'change', () => {
      this.value = this.$select.value;
    } );
    this.$label = this.shadowRoot.querySelector( 'p span:first-of-type' );    
  }

  focus() {
    this.$select.focus();
  }

  // When attributes change
  _render() {
    this.$label.textContent = this.label === null ? '' : this.label;
    this.$select.value = this.value === null ? this._options[0] : this.value;
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
    this._upgrade( 'options' );  
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

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get options() {
    return this._options.length === 0 ? null : this._options;
  }
  
  set options( value ) {
    this._options = value === null ? [] : [... value];

    while( this.$select.children.length > this._options.length ) {
      this.$select.children[0].remove();
    }

    while( this.$select.children.length < this._options.length ) {
      const option = document.createElement( 'option' );
      this.$select.appendChild( option );
    }

    for( let c = 0; c < this.$select.children.length; c++ ) {
      this.$select.children[c].value = this._options[c];
      this.$select.children[c].textContent = this._options[c];
    }
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

window.customElements.define( 'krh-select', HoytSelect );
