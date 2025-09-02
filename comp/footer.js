export default class HoytFooter extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          background: #1e293b;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
          width: 100%;
        }

        div[part=brand] p {
          color: #ffffff;
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          opacity: 0.80;
        }

        div[part=column] {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          max-width: var( --column-width );
          padding: 48px 16px 16px 16px;
          width: 100%;
        }

        div[part=container] {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 48px;          
          margin: 0 0 32px 0;
          width: 100%;
        }

        div[part=links] {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }        

        h3 {
          color: var( --secondary-text );
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
          margin: 0 0 16px 0;
          padding: 0;
        }

        p[part=copyright] {
          border-top: solid 1px #ffffff33;
          color: #ffffff;
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          margin: 0;
          opacity: 0.80;
          padding: 16px 0 0 0;
          text-align: center;
          width: 100%;
        }

        p a {
          color: #ffffff;
          transition: color 0.30s ease-in-out;
        }

        p a:hover {
          color: var( --secondary-text );
        }

        @media( max-width: 480px ) {
          div[part=container] {
            gap: 24px;
          }
        }                  
      </style>
      <div part="column">
        <div part="container">
          <div part="brand">
            <h3></h3>
            <p></p>
          </div>
          <div part="links">
            <slot></slot>
          </div>
        </div>
        <p part="copyright">© <span></span> <a href="https://ketnerlake.com">Ketner Lake</a>. All rights reserved.</p>
      </div>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$brand = this.shadowRoot.querySelector( 'h3' );
    this.$slogan = this.shadowRoot.querySelector( 'div[part=brand] p' );
    this.$year = this.shadowRoot.querySelector( 'p[part=copyright] span' );
  }

  // When attributes change
  _render() {
    this.$brand.textContent = this.brand === null ? '' : this.brand;
    this.$slogan.textContent = this.slogan === null ? '' : this.slogan;    

    const today = new Date();
    this.$year.textContent = today.getFullYear();
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
    this._upgrade( 'brand' );        
    this._upgrade( 'slogan' );      
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'brand',          
      'slogan'
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
  get brand() {
    if( this.hasAttribute( 'brand' ) ) {
      return this.getAttribute( 'brand' );
    }

    return null;
  }

  set brand( value ) {
    if( value !== null ) {
      this.setAttribute( 'brand', value );
    } else {
      this.removeAttribute( 'brand' );
    }
  }
  
  get slogan() {
    if( this.hasAttribute( 'slogan' ) ) {
      return this.getAttribute( 'slogan' );
    }

    return null;
  }

  set slogan( value ) {
    if( value !== null ) {
      this.setAttribute( 'slogan', value );
    } else {
      this.removeAttribute( 'slogan' );
    }
  }  
}

window.customElements.define( 'krh-footer', HoytFooter );
