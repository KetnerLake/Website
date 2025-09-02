export default class HoytStep extends HTMLElement {
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
          position: relative;
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

        p[part=count] {
          align-items: center;
          background: var( --gradient );
          border-radius: 60px;
          color: #ffffff;
          display: flex;
          font-family: 'Open Sans', sans-serif;
          font-size: 24px;          
          font-weight: 700;
          height: 60px;
          justify-content: center;
          line-height: 60px;
          margin: 0 0 24px 0;
          padding: 0;          
          width: 60px;
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
      </style>
      <p part="count"></p>
      <h3></h3>
      <p part="description">
        <slot></slot>
      </p>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$count = this.shadowRoot.querySelector( 'p[part=count]' );
    this.$title = this.shadowRoot.querySelector( 'h3' );    
  }

  // When attributes change
  _render() {
    this.$count.textContent = this.count === null ? '' : this.count;    
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
    this._upgrade( 'count' );            
    this._upgrade( 'title' );      
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'count',          
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
  get count() {
    if( this.hasAttribute( 'count' ) ) {
      return this.getAttribute( 'count' );
    }

    return null;
  }

  set count( value ) {
    if( value !== null ) {
      this.setAttribute( 'count', value );
    } else {
      this.removeAttribute( 'count' );
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

window.customElements.define( 'krh-step', HoytStep );
