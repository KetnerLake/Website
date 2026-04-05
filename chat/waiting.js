export default class BIWaiting extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          gap: 4px;
          position: relative;
          width: 100%;
        }        

        p {
          color: #1a1a1a;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 16px;
          line-height: 24px;
          margin: 0;
          padding: 8px 0 8px 4px;
        }

        :host( [hidden] ) {
          display: none;
        }

        @keyframes wave {
          0%, 100% { transform: translateY( 0 ); }
          50% { transform: translateY( -6px ); }
        }

        svg {
          animation: wave 1.2s ease-in-out infinite;
          flex-shrink: 0;
        }

        svg:nth-child( 1 ) { animation-delay: 0s; }
        svg:nth-child( 2 ) { animation-delay: 0.2s; }
        svg:nth-child( 3 ) { animation-delay: 0.4s; }
      </style>
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="currentColor"/></svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="currentColor"/></svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="currentColor"/></svg>            
      <p></p>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'p' );
  }

   // When attributes change
  _render() {
    this.$label.innerText = this.label === null ? '' : this.label;
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
    this._upgrade( 'hidden' );     
    this._upgrade( 'label' ); 
    this._render();
  }
  
  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden',
      'label'
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
  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }
}

window.customElements.define( 'bi-waiting', BIWaiting );
