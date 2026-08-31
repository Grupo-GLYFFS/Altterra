import SocialLogin from '../components/login/SocialLogin'
import EmailLogin from '../components/login/EmailLogin'

function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-panel">
        <div className="login-container">
          <a href="/">
            <img
              src={`${import.meta.env.BASE_URL}images/alterra-logo.svg`}
              alt="Altterra"
              className="login-logo"
            />
          </a>

          <h2 className="title-2xl">Entre ou cadastre-se</h2>

          <div className="login-methods">
            <SocialLogin />

            <div className="divider">
              <hr className="divider-line" />
              <p>ou</p>
              <hr className="divider-line" />
            </div>

            <EmailLogin />
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage