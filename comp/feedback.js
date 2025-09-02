export default class HoytFeedback extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background: #f8fafc;
          border-left: 4px solid #4f46e5;          
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

        p[part=comment] {
          color: #272727;
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-style: italic;
          font-weight: 400;
          line-height: 24px;
          margin: 0 0 24px 0;
          padding: 0;
        }        

        p[part=name] {
          color: #272727;
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
          margin: 0 0 8px 0;
          padding: 0;
        }

        p[part=result] {
          color: #64748b;
          font-family: 'Open Sans', sans-serif;          
          font-size: 14px;
          font-weight: 400;
          line-height: 18px;
          margin: 0;
          padding: 0;
        }        

        :host( :hover ) {
          box-shadow: rgba( 0, 0, 0, 0.1 ) 0px 10px 25px 0px;   
          transform: translateY( -8px );
        }
      </style>
      <p part="comment">
        <slot></slot>
      </p>
      <p part="name"></p>
      <p part="result">
        <span></span> • <span></span>
      </p>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$comment = this.shadowRoot.querySelector( 'p[part=comment]' );
    this.$method = this.shadowRoot.querySelector( 'p[part=result] span:last-of-type' );            
    this.$name = this.shadowRoot.querySelector( 'p[part=name]' );    
    this.$outcome = this.shadowRoot.querySelector( 'p[part=result] span:first-of-type' );    
  }

  // When attributes change
  _render() {
    this.$name.textContent = this.name === null ? '' : this.name;
    this.$outcome.textContent = this.outcome === null ? '' : this.outcome;        
    this.$method.textContent = this.method === null ? '' : this.method;        
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
    this._upgrade( 'method' );            
    this._upgrade( 'name' );      
    this._upgrade( 'outcome' );          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'method',          
      'name',
      'outcome'
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
  get method() {
    if( this.hasAttribute( 'method' ) ) {
      return this.getAttribute( 'method' );
    }

    return null;
  }

  set method( value ) {
    if( value !== null ) {
      this.setAttribute( 'method', value );
    } else {
      this.removeAttribute( 'method' );
    }
  }
  
  get name() {
    if( this.hasAttribute( 'name' ) ) {
      return this.getAttribute( 'name' );
    }

    return null;
  }

  set name( value ) {
    if( value !== null ) {
      this.setAttribute( 'name', value );
    } else {
      this.removeAttribute( 'name' );
    }
  }
  
  get outcome() {
    if( this.hasAttribute( 'outcome' ) ) {
      return this.getAttribute( 'outcome' );
    }

    return null;
  }

  set outcome( value ) {
    if( value !== null ) {
      this.setAttribute( 'outcome', value );
    } else {
      this.removeAttribute( 'outcome' );
    }
  }  
}

window.customElements.define( 'krh-feedback', HoytFeedback );
