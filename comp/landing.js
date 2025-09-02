export default class HoytLanding extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          background: var( --gradient );
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
          width: 100%;
        }

        div[part=column] {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: var( --column-width );
          padding: 64px 0 96px 0;
          width: 100%;
        }        

        div[part=left] {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: 0 0 0 32px;
          padding: 0 16px 0 16px;
        }

        div[part=media] {
          align-items: center;
          display: flex;
          justify-content: center;
        }

        div[part=tags] {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 16px;
        }

        img {
          border-radius: 20px;
          width: 300px;
        }

        @media( max-width: 768px ) {
          div[part=column] {
            grid-template-columns: 1fr;
          }

          div[part=left] {
            align-items: center;
            margin: 0;
          }

          div[part=tags] {
            justify-content: center;
            margin-bottom: 32px;
          }
        }
      </style>
      <div part="column">      
        <div part="left">
          <slot></slot>      
          <div part="tags">
            <slot name="tags"></slot>
          </div>
        </div>
        <div part="media">
          <img src="./img/fasting-countdown.png">
        </div>
      </div>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  // When attributes change
  _render() {;}

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

window.customElements.define( 'krh-landing', HoytLanding );
