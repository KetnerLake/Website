export default class BIInput extends HTMLElement {
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

        input {
          background: white;
          border: solid 1px grey;
          border-radius: 8px;
          box-sizing: border-box;
          color: #1a1a1a;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 16px;
          line-height: 24px;
          margin: 0;
          min-width: 0;
          outline: none;
          padding: 7px 16px 7px 16px;          
          width: 100%;
        }

        input:focus {
          border-color: purple;
          box-shadow: 0 0 0 3px color-mix( in srgb, purple 25%, transparent );          
        }

        p {
          color: #1a1a1a;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 16px;
          line-height: 24px;
          margin: 0;
          padding: 0 0 4px 0;
        }
      </style>
      <p></p>
      <input autocomplete="off" type="text" />
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'p' );
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'keyup', () => {
      this.value = this.$input.value.trim();
    } );
  }

   // When attributes change
  _render() {
    this.$label.innerText = this.label === null ? '' : this.label;
    this.$input.name = this.name === null ? '' : this.name;
    this.$input.placeholder = this.placeholder === null ? '' : this.placeholder;
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
    this._upgrade( 'placeholder' );     
    this._upgrade( 'value' );     
    this._render();
  }
  
  // Watched attributes
  static get observedAttributes() {
    return [
      'label',
      'name',
      'placeholder',
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
  
  get placeholder() {
    if( this.hasAttribute( 'placeholder' ) ) {
      return this.getAttribute( 'placeholder' );
    }

    return null;
  }

  set placeholder( value ) {
    if( value !== null ) {
      this.setAttribute( 'placeholder', value );
    } else {
      this.removeAttribute( 'placeholder' );
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

window.customElements.define( 'bi-input', BIInput );
