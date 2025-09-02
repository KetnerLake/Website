export default class HoytFeature extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba( 0, 0, 0, 0.05 );          
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          padding: 32px;
          position: relative;
          transform: translateY( 0 );
          transition: 
            box-shadow 0.30s ease-in-out,
            transform 0.30s ease-in-out;
        }

        h3 {
          color: #272727;
          font-family: 'Open Sans', sans-serif;
          font-size: 20px;
          font-weight: 700;
          line-height: 32px;
          margin: 0 0 16px 0;
          padding: 0;
        }

        p[part=description] {
          color: #64748b;
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          margin: 0;
          padding: 0;
          text-align: center;
        }        

        p[part=icon] {
          font-size: 48px;
          line-height: 76px;
          margin: 0 0 16px 0;
          padding: 0;
        }

        :host( :hover ) {
          box-shadow: rgba( 0, 0, 0, 0.1 ) 0px 10px 25px 0px;   
          transform: translateY( -8px );
        }
      </style>
      <p part="icon"></p>
      <h3></h3>
      <p part="description">
        <slot></slot>
      </p>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$icon = this.shadowRoot.querySelector( 'p[part=icon]' );
    this.$title = this.shadowRoot.querySelector( 'h3' );    
  }

  // When attributes change
  _render() {
    this.$icon.textContent = this.icon === null ? '' : this.icon;    
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
    this._upgrade( 'icon' );            
    this._upgrade( 'title' );      
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'icon',          
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
  get icon() {
    if( this.hasAttribute( 'icon' ) ) {
      return this.getAttribute( 'icon' );
    }

    return null;
  }

  set icon( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon', value );
    } else {
      this.removeAttribute( 'icon' );
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

window.customElements.define( 'krh-feature', HoytFeature );
