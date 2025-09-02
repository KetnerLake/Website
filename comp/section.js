export default class HoytSection extends HTMLElement {
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
          flex-direction: column;
          max-width: var( --column-width );
          padding: 96px 32px 96px 32px;          
          width: 100%;          
        }

        div[part=grid] {
          display: grid;
          gap: 32px;
          grid-template-columns: 1fr 1fr 1fr;
        }

        h2 {
          color: #272727;
          font-family: 'Open Sans', sans-serif;
          font-size: 40px;
          font-weight: 700;
          line-height: 64px;
          margin: 0 0 48px 0;
          padding: 0;        
          text-align: center;  
        }

        :host( [direction=row] ) div[part=column] {
          flex-direction: row;
        }

        :host( :not( [title] ) ) h2 {
          display: none;
        }

        @media( max-width: 768px ) {
          div[part=grid] {
            grid-template-columns: 1fr;            
          }
        }        

        @media( max-width: 480px ) {        
          h2 {
            font-size: 32px;
            line-height: 38px;
          }
        }
      </style>
      <div part="column">
        <h2></h2>
        <div part="grid">
          <slot></slot>
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
    this._upgrade( 'direction' );          
    this._upgrade( 'title' );      
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'direction',
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
  get direction() {
    if( this.hasAttribute( 'direction' ) ) {
      return this.getAttribute( 'direction' );
    }

    return null;
  }

  set direction( value ) {
    if( value !== null ) {
      this.setAttribute( 'direction', value );
    } else {
      this.removeAttribute( 'direction' );
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

window.customElements.define( 'krh-section', HoytSection );
