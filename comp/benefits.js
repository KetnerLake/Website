export default class HoytBenefits extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          background: var( --section-background, #f8fafc );
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
          width: 100%;
        }

        div[part=column] {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          gap: 64px;
          max-width: var( --column-width );
          padding: 96px 32px 96px 32px;          
          width: 100%;          
        }

        div[part=left] {
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 10;
        }

        div[part=right] {
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 5;
          gap: 32px;
        }        

        h2 {
          color: #272727;
          font-family: 'Open Sans', sans-serif;
          font-size: 40px;
          font-weight: 700;
          line-height: 64px;
          margin: 0 0 32px 0;
          padding: 0;        
        }

        @media( max-width: 480px ) {
          div[part=column] {
            flex-direction: column;
          }
        }                          
      </style>
      <div part="column">
        <div part="left">
          <h2></h2>        
          <slot></slot>
        </div>
        <div part="right">
          <slot name="right"></slot>
        </div>
      </div>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$title = this.shadowRoot.querySelector( 'h2' );    
  }

  // When attributes change
  _render() {
    this.$title.textContent = this.title === null ? '' : this.title;
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
    this._upgrade( 'title' );      
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
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

window.customElements.define( 'krh-benefits', HoytBenefits );
