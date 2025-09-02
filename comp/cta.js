export default class HoytCallToAction extends HTMLElement {
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

        div {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          max-width: var( --column-width );
          padding: 96px 32px 96px 32px;          
        }

        h2 {
          background: var( --gradient );
          color: #ffffff;
          font-family: 'Open Sans', sans-serif;
          font-size: 40px;
          font-weight: 700;
          line-height: 64px;
          margin: 0 0 16px 0;
          padding: 0;        
          text-align: center;
        }

        p {
          color: #ffffff;
          font-family: 'Open Sans', sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 24px;
          margin: 0 0 32px 0;
          padding: 0;        
        }        

        @media( max-width: 768px ) {
          p {
            text-align: center;
            max-width: 80%;
          }
        }  
        
        @media( max-width: 480px ) {
          h2 {
            font-size: 32px;
            line-height: 38px;
            max-width: 80%;
          }
        }          
      </style>
      <div>
        <h2></h2>
        <p></p>
        <slot></slot>
      </div>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$subtitle = this.shadowRoot.querySelector( 'p' );            
    this.$title = this.shadowRoot.querySelector( 'h2' );    
  }

  // When attributes change
  _render() {
    this.$title.textContent = this.title === null ? '' : this.title;
    this.$subtitle.textContent = this.subtitle === null ? '' : this.subtitle;    
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
    this._upgrade( 'subtitle' );      
    this._upgrade( 'title' );          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'subtitle',
      'title'
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
  get subtitle() {
    if( this.hasAttribute( 'subtitle' ) ) {
      return this.getAttribute( 'subtitle' );
    }

    return null;
  }

  set subtitle( value ) {
    if( value !== null ) {
      this.setAttribute( 'subtitle', value );
    } else {
      this.removeAttribute( 'subtitle' );
    }
  }

  get title() {
    if( this.hasAttribute( 'title' ) ) {
      return this.getAttribute( 'title' );
    }

    return null;
  }

  set title( value ) {
    if( value !== null ) {
      this.setAttribute( 'title', value );
    } else {
      this.removeAttribute( 'title' );
    }
  }  
}

window.customElements.define( 'krh-cta', HoytCallToAction );
