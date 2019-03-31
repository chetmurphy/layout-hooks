import * as React from 'react';

// tslint:disable-next-line:no-empty-interface
interface IErrorBoundaryProps {
}

interface IErrorBoundaryState {
  hasError: boolean;
  info: string
}

export default class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState>  {

  public static getDerivedStateFromError(error: string) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, info: error };
  }

  private info: string = ''
  
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, info: '' };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    // console.log(info)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h3>{this.info}</h3>;
    }

    return this.props.children; 
  }
}