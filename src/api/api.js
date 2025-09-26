import axios from 'axios';

// Create an axios instance with a base URL.
// IMPORTANT: Make sure your backend is running on this port.
const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
});

// --- Axios Request Interceptor ---
// This is the crucial part. It will run before every request is sent.
API.interceptors.request.use(
    (config) => {
        // Get the token from local storage
        const token = localStorage.getItem('token');
        
        // If a token exists, add it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);


API.interceptors.response.use(
    // If the response is successful (status 2xx), just return it.
    (response) => {
        return response;
    },
    // If the response has an error...
    (error) => {
        // Check if the error is a 403 Forbidden error.
        if (error.response && error.response.status === 403) {
            console.error("Authentication Error: Token is invalid or expired.");
            
            // Remove the invalid token from storage.
            localStorage.removeItem('token');
            
            // Redirect the user to the login page.
            // Using window.location.href forces a full page reload, which clears all state.
            window.location.href = '/login';
        }
        
        // For all other errors, just pass them along.
        return Promise.reject(error);
    }
);
// --- Quiz Management Endpoints ---


/**
 * Registers a new user.
 * @param {object} userData - { username, password, email, etc. }
 * @returns {Promise} Axios promise
 */
export const registerUser = (userData) => API.post('/auth/register', userData);

/**
 * Logs in a user.
 * @param {object} credentials - { username, password }
 * @returns {Promise} Axios promise, expected to return a JWT token .
 */
export const loginUser = (credentials) => API.post('/auth/login', credentials);

/**
 * Generates a new quiz.
 * @param {object} params - { category, numQ, title, timeLimit }
 * @returns {Promise} Axios promise
 */
export const generateQuiz = (params) => API.post('/quiz/generate', null, { params });

/**
 * Retrieves a summary of all available quizzes.
 * @returns {Promise} Axios promise
 */
export const getAllQuizzes = () => API.get('/quiz/all');

/**
 * Starts a quiz session for a user.
 * @param {number} quizId - The ID of the quiz to start.
 * @param {string} sessionId - A unique ID for this quiz attempt.
 * @returns {Promise} Axios promise
 */
export const startQuiz = (quizId, sessionId) => API.post(`/quiz/start/${quizId}`, null, { params: { sessionId } });

/**
 * Saves a user's answer for a single question during a quiz.
 * @param {string} sessionId - The unique session ID for the quiz attempt.
 * @param {object} progressData - { questionId, response }
 * @returns {Promise} Axios promise
 */
export const saveQuizProgress = (sessionId, progressData) => API.post(`/quiz/${sessionId}/progress`, progressData);


/**
 * Submits the user's answers for scoring.
 * @param {string} sessionId - The unique session ID for the quiz attempt.
 * @param {Array<object>} responses - List of response objects [{ rId, response }].
 * @returns {Promise} Axios promise
 */
export const submitQuiz = (sessionId, responses) => API.post(`/quiz/submit/${sessionId}`, responses);





/**
 * Creates a new, empty quiz shell.
 * @param {object} quizData - { title, timeLimit }
 * @returns {Promise} Axios promise
 */
export const createEmptyQuiz = (quizData) => API.post('/quiz/create', null, { params: quizData });

/**
 * Retrieves the details of a single quiz, including its questions.
 * @param {number} quizId - The ID of the quiz.
 * @returns {Promise} Axios promise
 */
export const getQuizById = (quizId) => API.get(`/quiz/${quizId}`);

/**
 * Adds a question to a specific quiz.
 * @param {number} quizId - The ID of the quiz.
 * @param {number} questionId - The ID of the question to add.
 * @returns {Promise} Axios promise
 */
export const addQuestionToQuiz = (quizId, questionId) => API.put(`/quiz/${quizId}/add/${questionId}`);

/**
 * Removes a question from a specific quiz.
 * @param {number} quizId - The ID of the quiz.
 * @param {number} questionId - The ID of the question to remove.
 * @returns {Promise} Axios promise
 */
export const removeQuestionFromQuiz = (quizId, questionId) => API.delete(`/quiz/${quizId}/remove/${questionId}`);







// --- Question Management Endpoints ---

/**
 * Adds a new question to the database.
 * @param {object} question - The question object.
 * @returns {Promise} Axios promise
 */
export const addQuestion = (question) => API.post('/question/add', question);

/**
 * Retrieves all questions from the database.
 * @returns {Promise} Axios promise
 */
export const getAllQuestions = () => API.get('/question/all');

/**
 * Retrieves all questions for a specific category.
 * @param {string} category - The category to filter by.
 * @returns {Promise} Axios promise
 */
export const getQuestionsByCategory = (category) => API.get(`/question/category/${category}`);

/**
 * Updates an existing question.
 * @param {number} qId - The ID of the question to update.
 * @param {object} question - The updated question object.
 * @returns {Promise} Axios promise
 */
export const updateQuestion = (qId, question) => API.put(`/question/update/${qId}`, question);

/**
 * Deletes a question from the database.
 * @param {number} qId - The ID of the question to delete.
 * @returns {Promise} Axios promise
 */
export const deleteQuestion = (qId) => API.delete(`/question/delete/${qId}`);
