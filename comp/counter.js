export default class HoytCounter extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba( 0, 0, 0, 0.05 );          
          box-sizing: border-box;
          display: inline-block;
          max-width: 325px;
          padding: 24px;
          position: relative;
          transform: translateY( 0 );
          transition: 
            box-shadow 0.30s ease-in-out,
            transform 0.30s ease-in-out;          
        } 

        p[part=label] {
          color: var( --light-text );          
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
          margin: 0;
          padding: 0;
          text-align: center;
        }

        p[part=value] {
          color: var( --gradient-start );          
          font-family: 'Open Sans', sans-serif;
          font-size: 40px;
          font-weight: 700;
          line-height: 64px;
          margin: 0 0 8px 0;
          padding: 0;
          text-align: center;
        }

        :host( :hover ) {
          box-shadow: rgba( 0, 0, 0, 0.1 ) 0px 10px 25px 0px;   
          transform: translateY( -8px );
        }
      </style>
      <p part="value"></p>
      <p part="label">
        <slot></slot>
      </p>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$value = this.shadowRoot.querySelector( 'p[part=value]' );        
  }

  // When attributes change
  _render() {
    this.$value.textContent = this.value === null ? '' : this.value;
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
    this._upgrade( 'value' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
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

window.customElements.define( 'krh-counter', HoytCounter );
