
interface checkDataRegisterProps {
    name: string,
    email: string,
    password: string,
    rePassword: string
}
const checkDataRegister = ({ name, email, password, rePassword }: checkDataRegisterProps) => {
    let errors: { [key: string]: string } = {};

    const cvName = name.trim();
    const cvEmail = email.trim();
    const cvPassword = password.trim();
    const cvRePassword = rePassword.trim();

    if(cvName.length < 4 || cvName.length > 20) {
        errors.name = "Tên phải có từ 4 đến 20 ký tự.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(cvEmail.length < 14 || cvEmail.length > 50 || !emailRegex.test(cvEmail)) {
        errors.email = "Email không hợp lệ.";
    }
    if(cvPassword.length < 4 || cvPassword.length > 20) {
        errors.password = "Mật khẩu phải có từ 4 đến 20 ký tự.";
    }
    if(cvRePassword.length < 4 || cvRePassword.length > 20) {
        errors.rePassword = "Mật khẩu phải có từ 4 đến 20 ký tự.";
    }

    if(cvPassword !== cvRePassword) {
        errors.rePassword = "Mật khẩu nhập không giống nhau.";
    }

    return errors;
}

export default checkDataRegister;