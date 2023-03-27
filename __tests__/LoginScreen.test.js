import { render, screen, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../screens/homeScreen/HomeScreen";
import { LoginScreen } from "../screens/loginScreen/LoginScreen";

// test("form submits two answers", () => {
//   const mockFn = jest.fn();
//   const profile = {};

//   render(<LoginScreen propProfile={profile} />);

//   const answerInputs = screen.getAllByLabelText("answer input");

//   fireEvent.changeText(answerInputs[0], "a1");
//   fireEvent.changeText(answerInputs[1], "a2");
//   fireEvent.press(screen.getByText("Submit"));

//   expect(mockFn).toBeCalledWith({
//     1: { q: "q1", a: "a1" },
//     2: { q: "q2", a: "a2" },
//   });
// });

test("examples of some things", async () => {
  const expectedPhoneNumber = "911234554321";

  render(<LoginScreen propProfile={profile} />);

  fireEvent.changeText(screen.getByTestId("phoneInput"), expectedPhoneNumber);
  fireEvent.press(screen.getByTestId("loginButton"));

  // Using `findBy` query to wait for asynchronous operation to finish

  const expectedOtp = "123456";
  const otpInput = await screen.findByTestId("otpInput");
  fireEvent.changeText(otpInput, expectedOtp);
  fireEvent.press(screen.getByTestId("confirmOtp"));
  // Using `toHaveTextContent` matcher from `@testing-library/jest-native` package.
  //   expect(usernameOutput).toHaveTextContent(expectedUsername);

  await expect(<HomeScreen />).toBeInTheDocument();
});
