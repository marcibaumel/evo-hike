using System.ComponentModel.DataAnnotations;
namespace evoHike.Backend.Attributes
{
        public class StrongPasswordAttribute : ValidationAttribute
        {
            public override bool IsValid(object? value)
            {
                if (value is not string password)
                    return false;

                bool hasNumber = password.Any(char.IsDigit);
                bool hasSpecial = password.Any(ch => !char.IsLetterOrDigit(ch));
                bool hasUpper = password.Any(char.IsUpper);
                bool hasLower = password.Any(char.IsLower);

                return hasNumber && hasSpecial && hasUpper && hasLower;
            }
        }
}
