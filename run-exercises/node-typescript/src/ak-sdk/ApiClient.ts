import axios, { AxiosInstance } from 'axios';
import {
  CreateSessionRequest,
  CreateSessionResponse,
  SessionScoreRequest,
  SessionScoreResponse,
  SessionLockRequest,
  SessionLockResponse,
  SessionInfoRequest,
  SessionInfoResponse,
  SessionRetrieveRequest,
  ExerciseValidateRequest,
  ExerciseInfoRequest,
} from './types/ApiTypes';
import {
  SessionRetrieveResponse,
  ExerciseValidateResponse,
  ExerciseInfoResponse,
} from './types/ApiTypes';

/**
 * ApiClient is a wrapper around Axios to interact with the Algebrakit Webservice API.
 */
export class ApiClient {
  private axiosInstance: AxiosInstance;

  /**
   * Initialize the API client with a base URL and API key.
   * @param baseUrl The base URL of the Algebrakit Webservice API.
   * @param apiKey The API key for authentication.
   */
  constructor(private baseUrl: string, private apiKey: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create new exercise sessions.
   * @param request The request payload for creating sessions.
   * @returns The response containing session creation results.
   */
  public async createSession(request: CreateSessionRequest): Promise<CreateSessionResponse> {
    return this.axiosInstance.post<CreateSessionResponse>('/session/create', request).then(r => r.data);
  }

  /**
   * Retrieve results from exercise sessions.
   * @param request The request payload for retrieving session scores.
   * @returns The response containing session scores.
   */
  public async getSessionScore(request: SessionScoreRequest): Promise<SessionScoreResponse> {
    return this.axiosInstance.post<SessionScoreResponse>('/session/score', request).then(r => r.data);
  }

  /**
   * Lock or unlock exercise sessions.
   * @param request The request payload for locking/unlocking sessions.
   * @returns The response confirming the action.
   */
  public async lockSession(request: SessionLockRequest): Promise<SessionLockResponse> {
    return this.axiosInstance.post<SessionLockResponse>('/sessions/lock', request).then(r => r.data);
  }

  /**
   * Retrieve detailed information about a session.
   * @param request The request payload for retrieving session information.
   * @returns The response containing session details.
   */
  public async getSessionInfo(request: SessionInfoRequest): Promise<SessionInfoResponse> {
    return this.axiosInstance.post<SessionInfoResponse>('/session/info', request).then(r => r.data);
  }

  /**
   * Retrieve existing sessions by their IDs.
   * @param request The request payload containing session IDs.
   * @returns The response containing session data for each ID.
   */
  public async retrieveSession(request: SessionRetrieveRequest): Promise<SessionRetrieveResponse> {
    return this.axiosInstance.post<SessionRetrieveResponse>('/session/retrieve', request).then(r => r.data);
  }

  /**
   * Validate an exercise definition or ID.
   * @param request The request payload for exercise validation.
   * @returns The response containing validation results and details.
   */
  public async validateExercise(request: ExerciseValidateRequest): Promise<ExerciseValidateResponse> {
    return this.axiosInstance.post<ExerciseValidateResponse>('/exercise/validate', request).then(r => r.data);
  }

  /**
   * Retrieve published information about an exercise (structure, versions, history).
   * @param request The request payload containing the exercise ID.
   * @returns The response containing published info about the exercise.
   */
  public async getExercisePublishedInfo(request: ExerciseInfoRequest): Promise<ExerciseInfoResponse> {
    return this.axiosInstance.post<ExerciseInfoResponse>('/exercise/published-info', request).then(r => r.data);
  }
}