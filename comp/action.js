export default class HoytAction extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          position: relative;
        } 

        a {
          background: var( --gradient );
          border-radius: 8px;
          box-shadow: 
            0 10px 15px -3px rgb( 0 0 0 / 0.10 ), 
            0 4px 6px -4px rgb( 0 0 0 / 0.10 );        
          box-sizing: border-box;
          color: #ffffff;
          display: inline-block;
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.50px;
          line-height: 24px;
          margin: 0;
          padding: 8px 16px 8px 16px;
          text-decoration: none;
          transform: translateY( 0 );
          transition: transform 0.15s ease-in-out;          
        }

        a:hover {
          transform: translateY( -4px );                  
        }        

        :host( [flat] ) a {
          background: var( --secondary-text );
        }

        :host( [size=lg] ) a {
          padding: 16px 24px 16px 24px;
        }

        :host( [size=xl] ) a {
          padding: 20px 32px 20px 32px;
        }        
      </style>
      <a target="_blank">
        <slot></slot>
      </a>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$anchor = this.shadowRoot.querySelector( 'a' );
  }

  // When attributes change
  _render() {
    this.$anchor.href = this.href === null ? '' : this.href;    
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
    this._upgrade( 'flat' );                
    this._upgrade( 'href' );                    
    this._upgrade( 'size' );                    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'flat',
      'href',
      'size'
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
  get flat() {
    return this.hasAttribute( 'flat' );
  }

  set flat( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'flat' );
      } else {
        this.setAttribute( 'flat', '' );
      }
    } else {
      this.removeAttribute( 'flat' );
    }
  }  

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

  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
    }

    return null;
  }

  set size( value ) {
    if( value !== null ) {
      this.setAttribute( 'size', value );
    } else {
      this.removeAttribute( 'size' );
    }
  }  
}

window.customElements.define( 'krh-action', HoytAction );
