import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="navbar navbar-light bg-light rounded">
      <Link className="navbar-brand mx-auto" to="/">
        <img
          src="https://i.pinimg.com/originals/e2/e8/79/e2e8799a6dcd24e05ee222d02303d319.png"
          width="75"
          height="75"
          className="d-inline-block"
          alt="Stock Exchange"
        />
        Stock Ex.
      </Link>
    </nav>
  );
};

export default Nav;
