export async function fetchQuestions(category, amount = 10) {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=multiple&difficulty=easy`
    );
    const data = await response.json();
    console.log('Data:', data);

    if (data.response_code !== 0) {
      throw new Error('No questions found.');
    }
    return data.results;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}
