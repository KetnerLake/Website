export default class HoytPage extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          margin: 48px 0 0 0;
          position: relative;
        }

        div[part=column] {
          box-sizing: border-box;
          display: block;
          max-width: 800px;
          padding: 96px 0 32px 0;          
          width: 100%;          
        }

        h1 {
          color: var( --primary-text );
          font-family: 'Open Sans', sans-serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 86px;
          margin: 0 0 16px 0;
          padding: 0;
          text-align: center;
        }

        @media( max-width: 820px ) {
          :host {
            padding: 0 48px 0 48px;            
          }

          div[part=column] {
            max-width: unset;
          }
        }  
        
        @media( max-width: 500px ) {
          :host {
            padding: 0 16px 0 16px;            
          }
        }        
      </style>
      <div part="column">
        <h1></h1>
        <slot name="description"></slot>
        <slot></slot>
      </div>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$title = this.shadowRoot.querySelector( 'h1' );    
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

window.customElements.define( 'krh-page', HoytPage );
