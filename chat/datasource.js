export default class BIDatasource extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: column;
          position: relative;    
          width: 100%;              
        } 

        bi-button {
          margin-left: auto;
        }

        form {
          background: rgba( 0, 0, 0, 0.04 );
          border-radius: 24px;          
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 50%;
          padding: 24px;
          width: 100%;
        }

        h3 {
          color: #1a1a1a;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
          margin: 0;
          padding: 0;
        }

        p {
          color: #1a1a1a;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 16px;
          margin: 0;
          padding: 0;
        }

        span {
          font-weight: 600;
        }

        :host( [filled] ) form,
        :host( :not( [filled] ) ) p {
          display: none;
        }
      </style>
      <form>
        <h3>Add Datasource</h3>
        <bi-input label="Datasource name" name="name" placeholder="Will appear in your library"></bi-input>
        <bi-select label="Database type" name="database" value="mysql">
          <bi-select-option label="DB2" value="db2"></bi-select-option>                
          <bi-select-option label="MongoDB" value="mongo"></bi-select-option>                
          <bi-select-option label="MySQL" selected value="mysql"></bi-select-option>
          <bi-select-option label="Oracle" value="oracle"></bi-select-option>        
          <bi-select-option label="PostgresSQL" value="postgres"></bi-select-option>        
          <bi-select-option label="SQLServer" value="sql"></bi-select-option>                
        </bi-select>      
        <bi-input label="Connection string" name="connection" placeholder="mydb://server.com:8080"></bi-input>      
        <bi-button label="Save"></bi-button>
      </form>
      <p>Using <span></span>.</p>
    `;
    
    // Private
    this._database = {
      db2: 'DB2',
      mongo: 'MongoDB',
      mysql: 'MySQL',
      oracle: 'Oracle',
      postgres: 'PostgresSQL',
      sql: 'SQLServer'
    };

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'p span' );
    this.$name = this.shadowRoot.querySelector( 'bi-input[name=name]' );
    this.$save = this.shadowRoot.querySelector( 'bi-button' );
    this.$save.addEventListener( 'click', () => {
      if( this.$name.value === null ) {
        alert( 'Datasource name is required.' );
        return;
      }

      this.$label.innerText = `${this.$name.value} (${this._database[this.$select.value]})`;
      this.filled = true;

      this.dispatchEvent( new CustomEvent( 'action', {
        bubbles: true,
        cancelable: false,
        composed: true
      } ) );
    } );
    this.$select = this.shadowRoot.querySelector( 'bi-select' );
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
    this._upgrade( 'filled' ); 
    this._render();
  }
  
  // Watched attributes
  static get observedAttributes() {
    return [
      'filled'
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
  get filled() {
    return this.hasAttribute( 'filled' );
  }

  set filled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'filled' );
      } else {
        this.setAttribute( 'filled', '' );
      }
    } else {
      this.removeAttribute( 'filled' );
    }
  }    
}

window.customElements.define( 'bi-datasource', BIDatasource );
