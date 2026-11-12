import {
  SkeletonWrapper,
  SkeletonHeader,
  SkeletonRow,
  SkeletonBox
} from './styles';

export default function DashboardSkeleton() {
  return (
    <SkeletonWrapper data-testid="dashboard-skeleton">
      <SkeletonHeader />
      <SkeletonRow>
        <SkeletonBox />
        <SkeletonBox />
      </SkeletonRow>
      <SkeletonRow>
        <SkeletonBox />
        <SkeletonBox />
      </SkeletonRow>
    </SkeletonWrapper>
  );
}

